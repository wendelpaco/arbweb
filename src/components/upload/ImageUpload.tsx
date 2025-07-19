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
    // Regex robusta: nome da casa (Stake (BR)), tipo, odd, stake, lucro
    // Exemplo: Stake (BR) Acima 2.5 1º o time 3.200 [E 614.75 BRL v 99.45
    const regex =
      /^([A-Za-z0-9 ]+\(BR\))\s+(.+?)\s+([0-9]{1,2}\.[0-9]{3})[^\d]+([0-9]+(?:[.,][0-9]{1,2})?)[^\d]+([0-9]+(?:[.,][0-9]{1,2})?)/;
    const m = lines[i].match(regex);
    if (m) {
      console.log("[PARSER] Linha OCR:", lines[i]);
      console.log("[PARSER] Nome extraído:", m[1]);
      console.log("[PARSER] Tipo de aposta extraído:", m[2]);
      console.log("[PARSER] Odd extraída:", m[3]);
      let oddsRaw = m[3].replace(",", ".");
      let odds = parseFloat(oddsRaw);
      if (!/^\d{1,2}\.\d{3}$/.test(m[3])) {
        console.warn("[PARSER] Odd ignorada (não tem 3 casas decimais):", m[3]);
        continue;
      }
      const name = m[1].trim();
      const betType = m[2].trim();
      // NOVA LÓGICA: pegar todos os números após a odd
      const afterOdd = lines[i].split(m[3])[1] || "";
      // Extrair todos os números decimais
      const numMatches = Array.from(
        afterOdd.matchAll(/([0-9]+(?:[.,][0-9]{1,2})?)/g)
      ).map((x) => x[1]);
      // Stake: maior número antes de 'BRL', ou maior número decimal
      let stake = 0;
      let profit = 0;
      if (numMatches.length) {
        // Tentar pegar stake antes de 'BRL'
        const beforeBrl = afterOdd.split(/BRL|brl/)[0];
        const stakeCandidates = Array.from(
          beforeBrl.matchAll(/([0-9]+(?:[.,][0-9]{1,2})?)/g)
        ).map((x) => parseFloat(x[1].replace(/,/g, ".")));
        if (stakeCandidates.length) {
          stake = Math.max(...stakeCandidates);
        } else {
          // Se não achar antes de BRL, pega o maior número decimal
          stake = Math.max(
            ...numMatches.map((x) => parseFloat(x.replace(/,/g, ".")))
          );
        }
        // Lucro: último número decimal da linha
        profit = parseFloat(
          numMatches[numMatches.length - 1].replace(/,/g, ".")
        );
      }
      console.log(`[PARSER] Stake extraído: ${stake}`);
      console.log(`[PARSER] Lucro extraído: ${profit}`);
      bookmakers.push({
        name,
        odds,
        betType,
        stake,
        profit,
      });
      console.log(
        `[PARSER] Resultado final: name=${name}, odds=${odds}, betType=${betType}, stake=${stake}, profit=${profit}`
      );
    } else {
      // Log linha não reconhecida para depuração
      if (
        lines[i].toLowerCase().includes("stake") ||
        lines[i].toLowerCase().includes("superbet")
      ) {
        console.warn(
          "[PARSER] Linha de aposta não reconhecida pelo parser:",
          lines[i]
        );
      }
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
