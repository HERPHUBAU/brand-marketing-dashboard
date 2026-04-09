import React, { useState, useEffect } from 'react';
import { Settings, ChevronUp, ChevronDown, X, Save, RotateCcw } from 'lucide-react';
import metricsService from '../services/metricsService';

const MetricsCustomizer = ({ userId, onMetricsChange, isOpen, onClose }) => {
  const [availableMetrics, setAvailableMetrics] = useState([]);
  const [selectedMetrics, setSelectedMetrics] = useState([]);
  const [editingThreshold, setEditingThreshold] = useState(null);

  useEffect(() => {
    if (isOpen) {
      loadMetrics();
    }
  }, [isOpen, userId]);

  const loadMetrics = () => {
    const allMetrics = metricsService.getAllMetrics();
    const userMetrics = metricsService.getUserMetrics(userId);
    
    setAvailableMetrics(allMetrics);
    setSelectedMetrics(userMetrics);
  };

  const toggleMetric = (metricId) => {
    const metric = availableMetrics.find(m => m.id === metricId);
    const isSelected = selectedMetrics.some(m => m.id === metricId);
    
    if (isSelected) {
      // Remove from selected
      setSelectedMetrics(selectedMetrics.filter(m => m.id !== metricId));
    } else {
      // Add to selected
      const newMetric = { ...metric, order: selectedMetrics.length + 1 };
      setSelectedMetrics([...selectedMetrics, newMetric]);
    }
  };

  const moveMetric = (index, direction) => {
    const newMetrics = [...selectedMetrics];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (newIndex >= 0 && newIndex < newMetrics.length) {
      [newMetrics[index], newMetrics[newIndex]] = [newMetrics[newIndex], newMetrics[index]];
      
      // Update order values
      newMetrics.forEach((metric, i) => {
        metric.order = i + 1;
      });
      
      setSelectedMetrics(newMetrics);
    }
  };

  const updateThreshold = (metricId, threshold) => {
    const newMetrics = selectedMetrics.map(metric => 
      metric.id === metricId ? { ...metric, threshold } : metric
    );
    setSelectedMetrics(newMetrics);
  };

  const saveMetrics = () => {
    metricsService.saveUserMetrics(userId, selectedMetrics);
    onMetricsChange(selectedMetrics);
    onClose();
  };

  const resetToDefault = () => {
    const defaultMetrics = metricsService.getAllMetrics().filter(m => m.default);
    setSelectedMetrics(defaultMetrics);
  };

  const formatThresholdValue = (threshold, value) => {
    switch (threshold.type) {
      case 'percentage':
        return `${value}%`;
      case 'currency':
        return `$${value}`;
      default:
        return value.toString();
    }
  };

  const getMetricIcon = (category) => {
    switch (category) {
      case 'marketing':
        return 'M';
      case 'brand':
        return 'B';
      case 'business':
        return '$';
      default:
        return 'K';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-6">
      <div className="bg-[#33302E] border border-[#45413E] p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-[#D8D3CC] font-black text-xl uppercase mb-2">Customize Dashboard</h3>
            <p className="text-[#D2B48C] text-sm">Select and arrange metrics for your Overview page</p>
          </div>
          <button onClick={onClose} className="text-[#D2B48C] hover:text-white">
            <X size={24} />
          </button>
        </div>

        {/* Actions */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={saveMetrics}
            className="flex items-center gap-2 bg-[#A84323] text-white px-6 py-3 uppercase text-[10px] font-black tracking-widest hover:brightness-110 transition-all"
          >
            <Save size={14} /> Save Changes
          </button>
          <button
            onClick={resetToDefault}
            className="flex items-center gap-2 bg-[#45413E] text-[#D8D3CC] px-6 py-3 uppercase text-[10px] font-black tracking-widest hover:bg-[#5A524F] transition-all"
          >
            <RotateCcw size={14} /> Reset to Default
          </button>
        </div>

        {/* Selected Metrics */}
        <div className="mb-8">
          <h4 className="text-[#D2B48C] text-sm font-bold mb-4 uppercase tracking-widest">Selected Metrics</h4>
          <div className="space-y-2">
            {selectedMetrics.length === 0 ? (
              <p className="text-[#D2B48C]/50 text-center py-8">No metrics selected. Choose metrics from the available options below.</p>
            ) : (
              selectedMetrics.map((metric, index) => (
                <div key={metric.id} className="bg-[#1A1817] border border-[#45413E] p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-[#A84323] rounded flex items-center justify-center text-white text-xs font-bold">
                          {getMetricIcon(metric.category)}
                        </div>
                        <div>
                          <div className="text-[#D8D3CC] font-bold">{metric.name}</div>
                          <div className="text-[#D2B48C]/60 text-xs uppercase">{metric.category}</div>
                        </div>
                      </div>
                      
                      {/* Threshold Display */}
                      <div className="text-[#D2B48C]/80 text-xs">
                        {metric.threshold.type === 'min' && `Min: ${formatThresholdValue(metric.threshold, metric.threshold.value)}`}
                        {metric.threshold.type === 'max' && `Max: ${formatThresholdValue(metric.threshold, metric.threshold.value)}`}
                        {metric.threshold.good === 'higher' && ' (higher is better)'}
                        {metric.threshold.good === 'lower' && ' (lower is better)'}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Move Controls */}
                      <button
                        onClick={() => moveMetric(index, 'up')}
                        disabled={index === 0}
                        className="p-1 text-[#D2B48C] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <ChevronUp size={16} />
                      </button>
                      <button
                        onClick={() => moveMetric(index, 'down')}
                        disabled={index === selectedMetrics.length - 1}
                        className="p-1 text-[#D2B48C] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <ChevronDown size={16} />
                      </button>
                      
                      {/* Remove */}
                      <button
                        onClick={() => toggleMetric(metric.id)}
                        className="p-1 text-red-400 hover:text-red-300"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Available Metrics */}
        <div>
          <h4 className="text-[#D2B48C] text-sm font-bold mb-4 uppercase tracking-widest">Available Metrics</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableMetrics
              .filter(metric => !selectedMetrics.some(m => m.id === metric.id))
              .map(metric => (
                <div
                  key={metric.id}
                  onClick={() => toggleMetric(metric.id)}
                  className="bg-[#1A1817] border border-[#45413E] p-4 cursor-pointer hover:border-[#A84323] transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#45413E] rounded flex items-center justify-center text-white text-xs font-bold">
                      {getMetricIcon(metric.category)}
                    </div>
                    <div>
                      <div className="text-[#D8D3CC] font-bold">{metric.name}</div>
                      <div className="text-[#D2B48C]/60 text-xs uppercase">{metric.category} · {metric.type}</div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricsCustomizer;
