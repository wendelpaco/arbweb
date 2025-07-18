import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import {
  validateImageFile,
  compressImage,
  extractTextFromImage,
} from "../../utils/ocr";
import { formatFileSize, formatFileName } from "../../utils/formatters";
import { validateAndCalculateArbitrage } from "../../utils/calculations";

// Função simples para parsear texto OCR em dados de arbitragem (ajuste conforme necessário)
function parseArbitrageFromText(text: string) {
  // Exemplo simplificado: busca odds, stakes e casas por regex
  // Este parser pode ser melhorado para lidar com diferentes layouts
  const lines = text
    .split(/\n|\r/)
    .map((l) => l.trim())
    .filter(Boolean);
  let match = { team1: "", team2: "", sport: "", competition: "" };
  let bookmakers = [];
  let foundTeams = false;

  // Detectar times e competição
  for (let line of lines) {
    if (!foundTeams && line.match(/\s*-\s*/)) {
      const [team1, team2] = line.split(/\s*-\s*/);
      if (team1 && team2) {
        match.team1 = team1.trim();
        match.team2 = team2.trim();
        foundTeams = true;
      }
    }
    if (line.toLowerCase().includes("futebol")) match.sport = "Futebol";
    if (
      line.toLowerCase().includes("copa") ||
      line.toLowerCase().includes("serie") ||
      line.toLowerCase().includes("liga") ||
      line.toLowerCase().includes("fa")
    ) {
      match.competition = line.trim();
    }
  }

  // Detectar casas, odds, stakes
  for (let i = 0; i < lines.length; i++) {
    const casaMatch = lines[i].match(/([A-Za-z0-9 ]+)(\(BR\))?/);
    const oddsMatch = lines[i + 1]?.match(/([0-9]+[.,][0-9]+)/);
    const stakeMatch = lines[i + 2]?.match(/([0-9]+[.,][0-9]+)/);
    if (casaMatch && oddsMatch && stakeMatch) {
      bookmakers.push({
        name: casaMatch[1].trim(),
        odds: parseFloat(oddsMatch[1].replace(",", ".")),
        betType: lines[i + 1],
        stake: parseFloat(stakeMatch[1].replace(",", ".")),
        profit: 0, // será calculado depois
      });
    }
  }

  return { match, bookmakers };
}

interface ImageUploadProps {
  onFileSelect: (file: File) => void;
  onProcessingStart: () => void;
  onProcessingComplete: (data: any) => void;
  onError: (error: string) => void;
  isProcessing?: boolean;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onFileSelect,
  onProcessingStart,
  onProcessingComplete,
  onError,
  isProcessing = false,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      const file = acceptedFiles[0];
      const validationError = validateImageFile(file);

      if (validationError) {
        onError(validationError);
        return;
      }

      try {
        // Compress image
        const compressedFile = await compressImage(file);
        setSelectedFile(compressedFile);

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreview(e.target?.result as string);
        };
        reader.readAsDataURL(compressedFile);

        onFileSelect(compressedFile);
      } catch (error) {
        onError("Erro ao processar imagem");
      }
    },
    [onFileSelect, onError]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png"],
    },
    multiple: false,
    disabled: isProcessing,
  });

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreview(null);
  };

  const handleProcess = async () => {
    if (!selectedFile) return;

    onProcessingStart();
    try {
      // OCR real
      const text = await extractTextFromImage(selectedFile);
      const { match, bookmakers } = parseArbitrageFromText(text);
      if (!match.team1 || !match.team2 || bookmakers.length === 0) {
        throw new Error("Não foi possível extrair dados válidos da imagem.");
      }
      // Calcular payouts e validar
      const totalInvestment = bookmakers.reduce((sum, bm) => sum + bm.stake, 0);
      const bmsWithProfit = bookmakers.map((bm) => ({
        ...bm,
        profit: bm.stake * bm.odds,
      }));
      const validation = validateAndCalculateArbitrage(bmsWithProfit);
      const processedData = {
        match,
        bookmakers: bmsWithProfit,
        metrics: validation.metrics,
        validation,
      };
      onProcessingComplete(processedData);
    } catch (error: any) {
      onError(error.message || "Erro ao processar imagem");
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card
        variant="outlined"
        className="border-dashed border-2 border-gray-300"
      >
        <div
          {...getRootProps()}
          className={`relative p-8 text-center transition-all duration-200 ${
            isDragActive
              ? "border-primary-500 bg-primary-50"
              : "hover:border-primary-400 hover:bg-gray-50"
          }`}
        >
          <input {...getInputProps()} />

          {!selectedFile ? (
            <div className="space-y-4">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <Upload className="w-8 h-8 text-gray-400" />
              </div>
              <div>
                <p className="text-lg font-medium text-gray-900">
                  Arraste e solte sua imagem aqui
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  ou clique para selecionar um arquivo
                </p>
              </div>
              <p className="text-xs text-gray-400">PNG, JPG, JPEG até 10MB</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative inline-block">
                <img
                  src={preview!}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-lg"
                />
                <button
                  onClick={handleRemoveFile}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-accent-500 text-white rounded-full flex items-center justify-center hover:bg-accent-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {formatFileName(selectedFile.name)}
                </p>
                <p className="text-sm text-gray-500">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Process Button */}
      {selectedFile && (
        <div className="flex justify-center">
          <Button
            onClick={handleProcess}
            loading={isProcessing}
            disabled={!selectedFile}
            size="lg"
            leftIcon={<ImageIcon className="w-5 h-5" />}
          >
            {isProcessing ? "Processando..." : "Processar Imagem"}
          </Button>
        </div>
      )}
    </div>
  );
};
