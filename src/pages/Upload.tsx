import React, { useState, useRef } from "react";
import { ImageUpload } from "../components/upload/ImageUpload";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { useArbitrageStore } from "../stores/arbitrage";
import { ArbitrageData, Match, Bookmaker } from "../types";
import { CheckCircle, XCircle, X } from "lucide-react";
import {
  formatCurrency,
  formatPercentage,
  formatProfit,
  formatROI,
} from "../utils/formatters";
import {
  Toast,
  ToastProvider,
  ToastViewport,
  ToastClose,
} from "../components/ui/Toast";
import { EditArbitrageModal } from "../components/ui/EditArbitrageModal";
import { useUIStore } from "../stores/ui";
import {
  calculateOptimalStakes,
  validateAndCalculateArbitrage,
} from "../utils/calculations";

export const Upload: React.FC = () => {
  const { addArbitrage, setLoading, setError } = useArbitrageStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedData, setProcessedData] = useState<any>(null);
  const [error, setLocalError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { debugOcr } = useUIStore();
  const imageUploadRef = useRef<any>(null);

  const handleFileSelect = (file: File) => {
    setIsProcessing(true);
    setLocalError(null);
    setProcessedData(null);
    setLoading(true);
    // Iniciar processamento automático
    (async () => {
      try {
        // OCR real
        const text = await import("../utils/ocr").then((m) =>
          m.extractTextFromImage(file)
        );
        let match,
          bookmakers,
          totalStakeExtraido = 0;
        const openaiKey = import.meta.env.VITE_OPENAI_API_KEY;
        if (openaiKey) {
          // Usar OpenAI para estruturar os dados
          const result = await import("../utils/openai").then((m) =>
            m.extractArbitrageWithOpenAI(text, openaiKey)
          );
          match = result.match;
          bookmakers = result.bookmakers;
          // Tentar extrair aposta total do JSON retornado
          if (result.metrics && result.metrics.totalStake) {
            totalStakeExtraido = result.metrics.totalStake;
          } else {
            // Regex para "Aposta total: 17200 BRL" no texto OCR
            const matchTotal = text.match(/Aposta total\s*[:=]?\s*([\d.,]+)/i);
            if (matchTotal && matchTotal[1]) {
              totalStakeExtraido = parseFloat(
                matchTotal[1].replace(/\./g, "").replace(",", ".")
              );
            }
          }
        } else {
          // Fallback para parser local usando processImageOCR
          const localResult = await import("../utils/ocr").then((m) =>
            m.processImageOCR(file)
          );
          match = localResult.match;
          bookmakers = localResult.bookmakers;
        }
        if (
          !match.team1 ||
          !match.team2 ||
          !bookmakers ||
          bookmakers.length === 0
        ) {
          handleProcessingComplete({
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
        // Se houver aposta total extraída e odds válidas, distribuir stakes de forma ótima
        let bmsWithProfit = bookmakers;
        if (
          totalStakeExtraido > 0 &&
          bookmakers.every((bm: any) => bm.odds > 1)
        ) {
          bmsWithProfit = calculateOptimalStakes(
            bookmakers,
            totalStakeExtraido
          );
        } else {
          bmsWithProfit = bookmakers.map((bm: any) => ({
            ...bm,
            profit: bm.stake * bm.odds,
          }));
        }
        const validation = validateAndCalculateArbitrage(bmsWithProfit);
        const processedData = {
          match,
          bookmakers: bmsWithProfit,
          metrics: validation.metrics,
          validation,
          ocrText: text,
        };
        handleProcessingComplete(processedData);
      } catch (error: any) {
        handleProcessingComplete({
          ocrText: "",
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
        handleError(error.message || "Erro ao processar imagem");
      } finally {
        setIsProcessing(false);
        setLoading(false);
      }
    })();
  };

  const handleProcessingStart = () => {
    setIsProcessing(true);
    setLocalError(null);
    setProcessedData(null);
    setLoading(true);
  };

  const handleProcessingComplete = (data: any) => {
    setIsProcessing(false);
    setLoading(false);
    setProcessedData(data);
    // Removido: addArbitrage(arbitrageData);
  };

  const handleError = (errorMessage: string) => {
    setIsProcessing(false);
    setLoading(false);
    setLocalError(errorMessage);
    setError(errorMessage);
  };

  const handleSaveArbitrage = () => {
    if (!processedData) return;
    // Salvar arbitragem apenas aqui
    const arbitrageData: ArbitrageData = {
      id: Date.now().toString(),
      timestamp: new Date(),
      match: processedData.match,
      bookmakers: processedData.bookmakers,
      metrics: processedData.metrics,
      imageUrl: "",
      status: "processed",
    };
    addArbitrage(arbitrageData);
    setToastMsg("Arbitragem salva com sucesso!");
    setShowToast(true);
    // Resetar states para novo upload
    setProcessedData(null);
    setLocalError(null);
    setIsProcessing(false);
    // Limpar imagem do upload
    imageUploadRef.current?.clear?.();
  };

  const handleDiscardArbitrage = () => {
    setProcessedData(null);
    setLocalError(null);
    setIsProcessing(false);
    setToastMsg("Arbitragem descartada.");
    setShowToast(true);
    // Limpar imagem do upload
    imageUploadRef.current?.clear?.();
  };

  const handleEdit = () => {
    setIsEditModalOpen(true);
  };

  const handleEditSave = (match: Match, bookmakers: Bookmaker[]) => {
    if (!processedData) return;
    // Apenas atualiza os dados processados, não salva no store
    const updatedData = {
      ...processedData,
      match,
      bookmakers,
    };
    setProcessedData(updatedData);
    setToastMsg("Dados editados com sucesso!");
    setShowToast(true);
  };

  return (
    <div className="p-6 space-y-6">
      <ToastProvider>
        <Toast
          open={showToast}
          onOpenChange={setShowToast}
          className="bg-green-600 text-white rounded-xl shadow-lg flex items-center gap-3 px-6 py-4 animate-in fade-in-0 slide-in-from-top-6"
        >
          <CheckCircle className="w-5 h-5 text-white" />
          <span className="font-medium">{toastMsg}</span>
          <ToastClose asChild>
            <button className="ml-auto p-1 rounded-full hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-white">
              <X className="w-4 h-4" />
            </button>
          </ToastClose>
        </Toast>
        <ToastViewport className="fixed top-6 right-6 z-[100]" />
        <EditArbitrageModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          match={
            processedData?.match || {
              team1: "",
              team2: "",
              sport: "",
              competition: "",
            }
          }
          bookmakers={processedData?.bookmakers || []}
          onSave={handleEditSave}
        />
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
            Upload de Imagens
          </h1>
          <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400">
            Faça upload de imagens de odds para análise automática de arbitragem
          </p>
        </div>

        {/* Upload Section */}
        <Card className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8 rounded-2xl shadow-md bg-white dark:bg-zinc-900 mb-6 sm:mb-8">
          <ImageUpload
            ref={imageUploadRef}
            onFileSelect={handleFileSelect}
            onProcessingStart={handleProcessingStart}
            onProcessingComplete={handleProcessingComplete}
            onError={handleError}
            isProcessing={isProcessing}
          />
        </Card>

        {/* Error Display */}
        {error && (
          <Card className="max-w-2xl mx-auto border-accent-200 bg-accent-50 p-4 sm:p-6 rounded-2xl flex items-center gap-3 mb-6 sm:mb-8">
            <X className="w-5 h-5 text-accent-600" />
            <div>
              <h3 className="font-medium text-accent-800">
                Erro no Processamento
              </h3>
              <p className="text-sm text-accent-700">{error}</p>
            </div>
          </Card>
        )}

        {/* Results Display */}
        {processedData && (
          <Card className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 rounded-2xl shadow-md bg-white dark:bg-zinc-900 mb-6 sm:mb-8">
            {/* OCR Debug */}
            {debugOcr && processedData.ocrText && (
              <details
                open
                className="mb-4 bg-gray-50 border border-gray-200 rounded p-3 text-xs text-gray-700"
              >
                <summary className="cursor-pointer font-semibold text-gray-600 mb-2">
                  Texto OCR extraído (debug)
                </summary>
                <pre className="whitespace-pre-wrap break-all">
                  {processedData.ocrText}
                </pre>
              </details>
            )}

            {/* Validation Status */}
            {processedData.validation && (
              <div
                className={`mb-2 p-4 rounded-t-xl flex items-center gap-3 ${
                  processedData.validation.isValid
                    ? "bg-green-50 border-b border-green-200"
                    : "bg-red-50 border-b border-red-200"
                }`}
              >
                {processedData.validation.isValid ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
                <div>
                  <h3
                    className={`font-medium text-lg ${
                      processedData.metrics &&
                      processedData.metrics.totalProfit < 0
                        ? "text-red-800"
                        : processedData.validation.isValid
                        ? "text-green-800"
                        : "text-red-800"
                    }`}
                  >
                    {processedData.metrics &&
                    processedData.metrics.totalProfit < 0
                      ? "Arbitragem Negativa encontrada"
                      : processedData.validation.isValid
                      ? "Arbitragem Válida"
                      : "Arbitragem Inválida"}
                  </h3>
                  <p
                    className={`text-sm ${
                      processedData.validation.isValid
                        ? "text-green-700"
                        : "text-red-700"
                    }`}
                  >
                    {processedData.validation.message}
                  </p>
                </div>
              </div>
            )}

            {/* Subtítulo discreto */}
            <div className="text-sm text-zinc-500 dark:text-zinc-400 mb-6 ml-1 mt-2">
              Dados extraídos com sucesso
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {/* Match Info */}
              <div>
                <h4 className="font-medium text-zinc-900 dark:text-zinc-100 mb-4">
                  Informações da Partida
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-zinc-600 dark:text-zinc-400">
                      Time 1:
                    </span>
                    <span
                      className={`font-medium ${
                        !processedData.match.team1
                          ? "text-red-600 animate-pulse"
                          : "text-zinc-900 dark:text-zinc-100"
                      }`}
                    >
                      {processedData.match.team1 || "Preencha o time 1"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-600 dark:text-zinc-400">
                      Time 2:
                    </span>
                    <span
                      className={`font-medium ${
                        !processedData.match.team2
                          ? "text-red-600 animate-pulse"
                          : "text-zinc-900 dark:text-zinc-100"
                      }`}
                    >
                      {processedData.match.team2 || "Preencha o time 2"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-600 dark:text-zinc-400">
                      Esporte:
                    </span>
                    <span
                      className={`font-medium ${
                        !processedData.match.sport
                          ? "text-red-600 animate-pulse"
                          : "text-zinc-900 dark:text-zinc-100"
                      }`}
                    >
                      {processedData.match.sport || "Preencha o esporte"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-600 dark:text-zinc-400">
                      Competição:
                    </span>
                    <span
                      className={`font-medium ${
                        !processedData.match.competition
                          ? "text-red-600 animate-pulse"
                          : "text-zinc-900 dark:text-zinc-100"
                      }`}
                    >
                      {processedData.match.competition ||
                        "Preencha a competição"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Metrics */}
              <div>
                <h4 className="font-medium text-zinc-900 dark:text-zinc-100 mb-4">
                  Métricas
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-zinc-600 dark:text-zinc-400">
                      Lucro Total:
                    </span>
                    <span
                      className={`font-medium ${
                        processedData.metrics &&
                        processedData.metrics.totalProfit < 0
                          ? "text-red-600"
                          : "text-green-600"
                      }`}
                    >
                      {processedData.metrics ? (
                        formatProfit(processedData.metrics.totalProfit)
                      ) : (
                        <span className="text-red-600">---</span>
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-600 dark:text-zinc-400">
                      Percentual de Lucro:
                    </span>
                    <span
                      className={`font-medium ${
                        processedData.metrics &&
                        processedData.metrics.profitPercentage < 0
                          ? "text-red-600"
                          : "text-green-600"
                      }`}
                    >
                      {processedData.metrics ? (
                        formatPercentage(processedData.metrics.profitPercentage)
                      ) : (
                        <span className="text-red-600">---</span>
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-600 dark:text-zinc-400">
                      ROI:
                    </span>
                    <span
                      className={`font-medium ${
                        processedData.metrics && processedData.metrics.roi < 0
                          ? "text-red-600"
                          : "text-green-600"
                      }`}
                    >
                      {processedData.metrics ? (
                        formatROI(processedData.metrics.roi)
                      ) : (
                        <span className="text-red-600">---</span>
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-600 dark:text-zinc-400">
                      Stake Total:
                    </span>
                    <span className="font-medium text-zinc-900 dark:text-zinc-100">
                      {processedData.metrics ? (
                        formatCurrency(processedData.metrics.totalStake)
                      ) : (
                        <span className="text-red-600">---</span>
                      )}
                    </span>
                  </div>
                  {processedData.metrics &&
                    processedData.metrics.arbitragePercentage > 0 && (
                      <div className="flex justify-between">
                        <span className="text-zinc-600 dark:text-zinc-400">
                          Percentual de Arbitragem:
                        </span>
                        <span className="font-medium text-green-600">
                          {processedData.metrics ? (
                            `${(
                              processedData.metrics.arbitragePercentage - 100
                            ).toFixed(2)}%`
                          ) : (
                            <span className="text-red-600">---</span>
                          )}
                        </span>
                      </div>
                    )}
                </div>
              </div>
            </div>

            {/* Bookmakers Table */}
            <div className="mt-6">
              <h4 className="font-medium text-zinc-900 dark:text-zinc-100 mb-4">
                Casas de Apostas
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full rounded-xl overflow-hidden">
                  <thead className="bg-zinc-100 dark:bg-zinc-800 sticky top-0 z-10">
                    <tr className="border-b border-zinc-200 dark:border-zinc-800">
                      <th className="text-left py-2 px-4 font-medium text-zinc-700 dark:text-zinc-300">
                        Casa
                      </th>
                      <th className="text-left py-2 px-4 font-medium text-zinc-700 dark:text-zinc-300">
                        Odds
                      </th>
                      <th className="text-left py-2 px-4 font-medium text-zinc-700 dark:text-zinc-300">
                        Tipo
                      </th>
                      <th className="text-left py-2 px-4 font-medium text-zinc-700 dark:text-zinc-300">
                        Stake
                      </th>
                      <th className="text-left py-2 px-4 font-medium text-zinc-700 dark:text-zinc-300">
                        Payout
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {processedData.bookmakers.map(
                      (bookmaker: any, index: number) => (
                        <tr
                          key={index}
                          className="border-b border-zinc-100 dark:border-zinc-800"
                        >
                          <td className="py-3 px-4 font-medium text-zinc-900 dark:text-zinc-100">
                            {bookmaker.name}
                          </td>
                          <td className="py-3 px-4 text-zinc-900 dark:text-zinc-100">
                            {bookmaker.odds}
                          </td>
                          <td className="py-3 px-4 text-zinc-900 dark:text-zinc-100">
                            {bookmaker.betType}
                          </td>
                          <td className="py-3 px-4 text-zinc-900 dark:text-zinc-100">
                            {formatCurrency(bookmaker.stake)}
                          </td>
                          <td className="py-3 px-4 text-green-600 dark:text-green-400 font-medium">
                            {formatCurrency(bookmaker.profit)}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-4 mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-800">
              <Button
                variant="outline"
                size="lg"
                className="rounded-xl px-8 py-2 text-base font-medium"
                onClick={handleEdit}
              >
                Editar Dados
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="rounded-xl px-8 py-2 text-base font-medium"
                onClick={handleDiscardArbitrage}
              >
                Descartar
              </Button>
              <Button
                size="lg"
                className="rounded-xl px-8 py-2 text-base font-medium"
                onClick={handleSaveArbitrage}
                disabled={!processedData}
              >
                Salvar Arbitragem
              </Button>
            </div>
          </Card>
        )}
      </ToastProvider>
    </div>
  );
};
