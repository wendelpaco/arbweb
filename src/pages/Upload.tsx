import React, { useState } from "react";
import { ImageUpload } from "../components/upload/ImageUpload";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { useArbitrageStore } from "../stores/arbitrage";
import { ArbitrageData, Match, Bookmaker } from "../types";
import {
  Upload as UploadIcon,
  CheckCircle,
  AlertCircle,
  XCircle,
  Info,
} from "lucide-react";
import { formatCurrency, formatPercentage } from "../utils/formatters";
import { Toast } from "../components/ui/Toast";
import { EditArbitrageModal } from "../components/ui/EditArbitrageModal";

export const Upload: React.FC = () => {
  const { addArbitrage, setLoading, setError } = useArbitrageStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedData, setProcessedData] = useState<any>(null);
  const [error, setLocalError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleFileSelect = (file: File) => {
    console.log("File selected:", file);
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

    // Create arbitrage data
    const arbitrageData: ArbitrageData = {
      id: Date.now().toString(),
      timestamp: new Date(),
      match: data.match,
      bookmakers: data.bookmakers,
      metrics: data.metrics,
      imageUrl: "",
      status: "processed",
    };

    addArbitrage(arbitrageData);
  };

  const handleError = (errorMessage: string) => {
    setIsProcessing(false);
    setLoading(false);
    setLocalError(errorMessage);
    setError(errorMessage);
  };

  const handleSaveArbitrage = () => {
    if (!processedData) return;
    // Salvar novamente só se quiser sobrescrever, aqui só feedback
    setToastMsg("Arbitragem salva com sucesso!");
    setShowToast(true);
  };

  const handleEdit = () => {
    setIsEditModalOpen(true);
  };

  const handleEditSave = (match: Match, bookmakers: Bookmaker[]) => {
    if (!processedData) return;
    // Atualiza dados processados e salva no store
    const updatedData = {
      ...processedData,
      match,
      bookmakers,
    };
    setProcessedData(updatedData);
    // Atualiza no store
    const arbitrageData: ArbitrageData = {
      id: Date.now().toString(),
      timestamp: new Date(),
      match,
      bookmakers,
      metrics: processedData.metrics, // recompute se necessário
      imageUrl: "",
      status: "processed",
    };
    addArbitrage(arbitrageData);
    setToastMsg("Dados editados com sucesso!");
    setShowToast(true);
  };

  return (
    <div className="p-6 space-y-6">
      {showToast && (
        <Toast message={toastMsg} onClose={() => setShowToast(false)} />
      )}
      <EditArbitrageModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        match={processedData?.match}
        bookmakers={processedData?.bookmakers}
        onSave={handleEditSave}
      />
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Upload de Imagens
        </h1>
        <p className="text-gray-600">
          Faça upload de imagens de odds para análise automática de arbitragem
        </p>
      </div>

      {/* Upload Section */}
      <div className="max-w-2xl mx-auto">
        <ImageUpload
          onFileSelect={handleFileSelect}
          onProcessingStart={handleProcessingStart}
          onProcessingComplete={handleProcessingComplete}
          onError={handleError}
          isProcessing={isProcessing}
        />
      </div>

      {/* Error Display */}
      {error && (
        <Card className="max-w-2xl mx-auto border-accent-200 bg-accent-50">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-accent-600" />
            <div>
              <h3 className="font-medium text-accent-800">
                Erro no Processamento
              </h3>
              <p className="text-sm text-accent-700">{error}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Results Display */}
      {processedData && (
        <Card className="max-w-4xl mx-auto">
          {/* Validation Status */}
          {processedData.validation && (
            <div
              className={`mb-2 p-4 rounded-t-lg ${
                processedData.validation.isValid
                  ? "bg-secondary-50 border-b border-secondary-200"
                  : "bg-accent-50 border-b border-accent-200"
              }`}
            >
              <div className="flex items-center space-x-3">
                {processedData.validation.isValid ? (
                  <CheckCircle className="w-5 h-5 text-secondary-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-accent-600" />
                )}
                <div>
                  <h3
                    className={`font-medium text-lg ${
                      processedData.validation.isValid
                        ? "text-secondary-800"
                        : "text-accent-800"
                    }`}
                  >
                    {processedData.validation.isValid
                      ? "Arbitragem Válida"
                      : "Arbitragem Inválida"}
                  </h3>
                  <p
                    className={`text-sm ${
                      processedData.validation.isValid
                        ? "text-secondary-700"
                        : "text-accent-700"
                    }`}
                  >
                    {processedData.validation.message}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Subtítulo discreto */}
          <div className="text-sm text-gray-500 mb-6 ml-1 mt-2">
            Dados extraídos com sucesso
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Match Info */}
            <div>
              <h4 className="font-medium text-gray-900 mb-4">
                Informações da Partida
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Time 1:</span>
                  <span className="font-medium">
                    {processedData.match.team1}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Time 2:</span>
                  <span className="font-medium">
                    {processedData.match.team2}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Esporte:</span>
                  <span className="font-medium">
                    {processedData.match.sport}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Competição:</span>
                  <span className="font-medium">
                    {processedData.match.competition}
                  </span>
                </div>
              </div>
            </div>

            {/* Metrics */}
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Métricas</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Lucro Total:</span>
                  <span
                    className={`font-medium ${
                      processedData.metrics.totalProfit >= 0
                        ? "text-secondary-600"
                        : "text-accent-600"
                    }`}
                  >
                    {formatCurrency(processedData.metrics.totalProfit)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Percentual de Lucro:</span>
                  <span className="font-medium text-secondary-600">
                    {formatPercentage(processedData.metrics.profitPercentage)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">ROI:</span>
                  <span className="font-medium text-secondary-600">
                    {formatPercentage(processedData.metrics.roi)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Stake Total:</span>
                  <span className="font-medium">
                    {formatCurrency(processedData.metrics.totalStake)}
                  </span>
                </div>
                {processedData.metrics.arbitragePercentage > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      Percentual de Arbitragem:
                    </span>
                    <span className="font-medium text-secondary-600">
                      {formatPercentage(
                        processedData.metrics.arbitragePercentage
                      )}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bookmakers Table */}
          <div className="mt-6">
            <h4 className="font-medium text-gray-900 mb-4">Casas de Apostas</h4>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-4 font-medium text-gray-700">
                      Casa
                    </th>
                    <th className="text-left py-2 px-4 font-medium text-gray-700">
                      Odds
                    </th>
                    <th className="text-left py-2 px-4 font-medium text-gray-700">
                      Tipo
                    </th>
                    <th className="text-left py-2 px-4 font-medium text-gray-700">
                      Stake
                    </th>
                    <th className="text-left py-2 px-4 font-medium text-gray-700">
                      Payout
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {processedData.bookmakers.map(
                    (bookmaker: any, index: number) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-3 px-4 font-medium">
                          {bookmaker.name}
                        </td>
                        <td className="py-3 px-4">{bookmaker.odds}</td>
                        <td className="py-3 px-4">{bookmaker.betType}</td>
                        <td className="py-3 px-4">
                          {formatCurrency(bookmaker.stake)}
                        </td>
                        <td className="py-3 px-4 text-secondary-600 font-medium">
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
          <div className="flex justify-end space-x-4 mt-6 pt-6 border-t border-gray-200">
            <Button variant="outline" onClick={handleEdit}>
              Editar Dados
            </Button>
            <Button
              onClick={handleSaveArbitrage}
              disabled={!processedData.validation?.isValid}
            >
              Salvar Arbitragem
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};
