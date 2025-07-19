import React, {
  useState,
  useCallback,
  useImperativeHandle,
  forwardRef,
} from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X } from "lucide-react";
import { Card } from "../ui/Card";
import {
  validateImageFile,
  compressImage,
  extractTextFromImage,
} from "../../utils/ocr";
import { formatFileSize, formatFileName } from "../../utils/formatters";
import { validateAndCalculateArbitrage } from "../../utils/calculations";
// import { extractArbitrageWithOpenAI } from "../../utils/openai";

// Função robusta para parsear texto OCR em dados de arbitragem
function parseArbitrageFromText(text: string) {
  const lines = text
    .split(/\n|\r/)
    .map((l) => l.trim())
    .filter(Boolean);
  let match = { team1: "", team2: "", sport: "", competition: "" };
  let bookmakers = [];
  let foundTeams = false;
  let stakesArray: number[] = [];

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
      const stakeMatch = line.match(/([0-9.,]+)/);
      if (stakeMatch) {
        // stakeTotal = parseFloat(stakeMatch[1].replace(/,/g, ".")); // Removed as per edit hint
      }
    }
  }

  // Detectar casas, odds, stakes, lucros
  for (let i = 0; i < lines.length; i++) {
    // Regex para odds, stake e lucro (números com ponto ou vírgula)
    const regex =
      /([A-Za-z0-9 ()\-+\.]+)\s+([0-9]{1,6}(?:[.,][0-9]{1,3})?)\s+([A-Za-z0-9 ()\-+\.]*)\s*([0-9]{1,8}(?:[.,][0-9]{1,2})?)\s*[A-Za-z]*\s*([0-9]{1,8}(?:[.,][0-9]{1,2})?)/;
    const m = lines[i].match(regex);
    if (m) {
      // Odds
      let oddsRaw = m[2].replace(",", ".");
      let odds = parseFloat(oddsRaw);
      // Odds: tratar '325.' ou '325' como '3.25'
      if (
        (/^\d{3}\.?$/.test(oddsRaw) || /^\d{1,2}[.,]\d{1,3}$/.test(oddsRaw)) &&
        (isNaN(odds) || odds < 1.01 || odds > 100)
      ) {
        // Ex: '325.' ou '325' → '3.25'
        odds = parseFloat(
          oddsRaw.replace(/\.$/, "").slice(0, -2) +
            "." +
            oddsRaw.replace(/\.$/, "").slice(-2)
        );
        console.log(`Corrigindo odds colada: ${oddsRaw} → ${odds}`);
      }
      // Odds válidas: 1.01 a 100
      if (isNaN(odds) || odds < 1.01 || odds > 100) {
        odds = 0; // Marcar como erro de OCR
      }
      // Stake
      let stakeRaw = m[4].replace(/,/g, ".");
      let stake = parseFloat(stakeRaw);
      // Corrigir stake colado (ex: 129000 → 1290.00), mas só se for >= 5 dígitos, > 9999 e sem ponto
      if (
        !isNaN(stake) &&
        stake > 9999 &&
        /^\d{5,}$/.test(stakeRaw) &&
        !stakeRaw.includes(".")
      ) {
        stake = parseFloat(stakeRaw.slice(0, -2) + "." + stakeRaw.slice(-2));
        console.log(`Corrigindo stake colado: ${stakeRaw} → ${stake}`);
      }
      // Aceitar apenas até 2 casas decimais
      if (isNaN(stake) || !/^\d{1,6}(?:[.,]\d{1,2})?$/.test(stake.toString())) {
        stake = 0;
      }
      stakesArray.push(stake);
      // Lucro
      let profitRaw = m[5] ? m[5].replace(/,/g, ".") : "";
      let profit = profitRaw ? parseFloat(profitRaw) : 0;
      // Corrigir lucro colado (opcional, mesmo padrão do stake)
      if (
        (isNaN(profit) || profit > 10000) &&
        /^\d{5,}$/.test(profitRaw) &&
        !profitRaw.includes(".")
      ) {
        profit = parseFloat(profitRaw.slice(0, -2) + "." + profitRaw.slice(-2));
        console.log(`Corrigindo lucro colado: ${profitRaw} → ${profit}`);
      }
      bookmakers.push({
        name: m[1].trim(),
        odds,
        betType: m[3]?.trim() || "",
        stake,
        profit,
      });
    }
  }

  // Validação: stakes absurdos
  const totalStakes = stakesArray.reduce((a, b) => a + b, 0);
  for (let bm of bookmakers) {
    if (bm.stake > 10000 || bm.stake > 10 * (totalStakes - bm.stake)) {
      bm.stake = 0; // Marcar como erro de OCR
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

    // Iniciar processamento automático ao selecionar arquivo
    React.useEffect(() => {
      if (selectedFile) {
        handleProcess();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedFile]);

    useImperativeHandle(ref, () => ({
      clear: () => {
        setSelectedFile(null);
        setPreview(null);
        setOcrText("");
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
        // Sempre usar parser local, ignorar OpenAI
        const parsed = parseArbitrageFromText(text);
        match = parsed.match;
        bookmakers = parsed.bookmakers;
        if (
          !match.team1 ||
          !match.team2 ||
          !bookmakers ||
          bookmakers.length === 0
        ) {
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
      <div className="space-y-4 sm:space-y-6">
        {/* Upload Area */}
        <Card className="border-dashed border-2 border-gray-300">
          <div
            {...getRootProps()}
            className={`relative p-4 sm:p-6 lg:p-8 text-center transition-all duration-200 ${
              isDragActive
                ? "border-primary-500 bg-primary-50"
                : "hover:border-primary-400 hover:bg-gray-50"
            }`}
          >
            <input {...getInputProps()} />

            {!selectedFile ? (
              <div className="space-y-3 sm:space-y-4">
                <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                </div>
                <div>
                  <p className="text-base sm:text-lg font-medium text-gray-900">
                    Arraste e solte sua imagem aqui
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    ou clique para selecionar um arquivo
                  </p>
                </div>
                <p className="text-xs text-gray-400">PNG, JPG, JPEG até 10MB</p>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                <div className="relative inline-block">
                  <img
                    src={preview!}
                    alt="Preview"
                    className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg"
                  />
                  <button
                    onClick={handleRemoveFile}
                    className="absolute -top-2 -right-2 w-5 h-5 sm:w-6 sm:h-6 bg-accent-500 text-white rounded-full flex items-center justify-center hover:bg-accent-600 transition-colors"
                  >
                    <X className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm sm:text-base">
                    {formatFileName(selectedFile.name)}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500">
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>
                {isProcessing && (
                  <div className="flex justify-center items-center mt-4">
                    <svg
                      className="animate-spin h-5 w-5 sm:h-6 sm:w-6 text-primary-500 mr-2"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                    <span className="text-primary-600 font-medium text-sm sm:text-base">
                      Processando imagem...
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>

        {/* Process Button */}
        {/* Removido: botão de processamento manual */}
        {/* Ao selecionar um arquivo, o processamento já é iniciado automaticamente */}
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
