import React, {
  useState,
  useCallback,
  useImperativeHandle,
  forwardRef,
} from "react";
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
import { extractArbitrageWithOpenAI } from "../../utils/openai";

// Função robusta para parsear texto OCR em dados de arbitragem
function parseArbitrageFromText(text: string) {
  const lines = text
    .split(/\n|\r/)
    .map((l) => l.trim())
    .filter(Boolean);
  let match = { team1: "", team2: "", sport: "", competition: "" };
  let bookmakers = [];
  let foundTeams = false;
  let stakeTotal = 0;

  // Detectar times e competição
  for (let line of lines) {
    if (!foundTeams && line.match(/\s*[—-]\s*/)) {
      const [team1, team2] = line.split(/\s*[—-]\s*/);
      if (team1 && team2) {
        match.team1 = team1.trim();
        match.team2 = team2.trim();
        foundTeams = true;
      }
    }
    if (line.toLowerCase().includes("futebol")) match.sport = "Futebol";
    if (
      line.toLowerCase().includes("serie") ||
      line.toLowerCase().includes("liga") ||
      line.toLowerCase().includes("copa") ||
      line.toLowerCase().includes("brasil")
    ) {
      match.competition = line.replace(/futebol\s*\//i, "").trim();
    }
    // Detectar stake total
    if (line.toLowerCase().includes("aposta total")) {
      const stakeMatch = line.match(/([0-9]{3,}[.,]?[0-9]*)/);
      if (stakeMatch) {
        stakeTotal = parseFloat(stakeMatch[1].replace(/,/g, "."));
      }
    }
  }

  // Detectar casas, odds, stakes, lucros
  for (let i = 0; i < lines.length; i++) {
    // Regex para odds, stake e lucro (números com ponto ou vírgula, ou colados)
    const regex =
      /([A-Za-z0-9 ()\-+\.]+)\s+([0-9]{1,2}(?:[.,][0-9]+)?)\s+([A-Za-z0-9 ()\-+\.]+)?\s*([0-9]{4,}(?:[.,][0-9]+)?)\s*[A-Za-z]*\s*([0-9]{3,}(?:[.,][0-9]+)?)/;
    const m = lines[i].match(regex);
    if (m) {
      // Corrigir números colados (ex: 1731185 → 17311.85 se stake for muito grande)
      let stake = m[4];
      if (stake.length > 6 && stake.indexOf(".") === -1) {
        stake = stake.slice(0, -2) + "." + stake.slice(-2);
      }
      let profit = m[5];
      if (profit && profit.length > 6 && profit.indexOf(".") === -1) {
        profit = profit.slice(0, -2) + "." + profit.slice(-2);
      }
      bookmakers.push({
        name: m[1].trim(),
        odds: parseFloat(m[2].replace(",", ".")),
        betType: m[3]?.trim() || "",
        stake: parseFloat(stake.replace(/,/g, ".")),
        profit: profit ? parseFloat(profit.replace(/,/g, ".")) : 0,
      });
    }
  }

  return { match, bookmakers, stakeTotal };
}

interface ImageUploadProps {
  onFileSelect: (file: File) => void;
  onProcessingStart: () => void;
  onProcessingComplete: (data: any) => void;
  onError: (error: string) => void;
  isProcessing?: boolean;
}

export const ImageUpload = forwardRef<any, ImageUploadProps>(
  (
    {
      onFileSelect,
      onProcessingStart,
      onProcessingComplete,
      onError,
      isProcessing = false,
    },
    ref
  ) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [ocrText, setOcrText] = useState<string>("");
    const [autoEdit, setAutoEdit] = useState(false);

    useImperativeHandle(ref, () => ({
      clear: () => {
        setSelectedFile(null);
        setPreview(null);
        setOcrText("");
        setAutoEdit(false);
      },
    }));

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
        setOcrText(text);
        let match, bookmakers;
        const openaiKey = import.meta.env.VITE_OPENAI_API_KEY;
        if (openaiKey) {
          // Usar OpenAI para estruturar os dados
          const result = await extractArbitrageWithOpenAI(text, openaiKey);
          match = result.match;
          bookmakers = result.bookmakers;
        } else {
          // Fallback para parser local
          const parsed = parseArbitrageFromText(text);
          match = parsed.match;
          bookmakers = parsed.bookmakers;
        }
        if (
          !match.team1 ||
          !match.team2 ||
          !bookmakers ||
          bookmakers.length === 0
        ) {
          setAutoEdit(true); // abrir modal de edição automática
          // Chamar onProcessingComplete para garantir que o texto OCR seja exibido
          onProcessingComplete({
            ocrText: text,
            match: match || {},
            bookmakers: bookmakers || [],
            metrics: {
              totalProfit: 0,
              profitPercentage: 0,
              roi: 0,
              totalStake: 0,
              arbitragePercentage: 0,
            },
            validation: {
              isValid: false,
              message: "Dados incompletos",
              metrics: {
                totalProfit: 0,
                profitPercentage: 0,
                roi: 0,
                totalStake: 0,
                arbitragePercentage: 0,
              },
            },
          });
          throw new Error(
            "Não foi possível extrair dados válidos da imagem. Edite manualmente."
          );
        }
        // Calcular payouts e validar
        const bmsWithProfit = bookmakers.map((bm: any) => ({
          ...bm,
          profit: bm.stake * bm.odds,
        }));
        const validation = validateAndCalculateArbitrage(bmsWithProfit);
        const processedData = {
          match,
          bookmakers: bmsWithProfit,
          metrics: validation.metrics,
          validation,
          ocrText: text,
        };
        onProcessingComplete(processedData);
      } catch (error: any) {
        // Sempre chamar onProcessingComplete para garantir debug
        if (ocrText) {
          onProcessingComplete({
            ocrText,
            match: {},
            bookmakers: [],
            metrics: {
              totalProfit: 0,
              profitPercentage: 0,
              roi: 0,
              totalStake: 0,
              arbitragePercentage: 0,
            },
            validation: {
              isValid: false,
              message: "Erro no OCR",
              metrics: {
                totalProfit: 0,
                profitPercentage: 0,
                roi: 0,
                totalStake: 0,
                arbitragePercentage: 0,
              },
            },
          });
        }
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
  }
);

declare global {
  interface ImportMeta {
    env: {
      VITE_OPENAI_API_KEY?: string;
      [key: string]: any;
    };
  }
}
