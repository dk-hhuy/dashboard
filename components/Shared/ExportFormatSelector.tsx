import React from 'react';
import { ExportFormat } from '@/lib/exportUtils';

interface ExportFormatSelectorProps {
  selectedFormat: ExportFormat;
  onFormatChange: (format: ExportFormat) => void;
  disabled?: boolean;
}

const ExportFormatSelector: React.FC<ExportFormatSelectorProps> = React.memo(({
  selectedFormat,
  onFormatChange,
  disabled = false
}) => {
  const formats: { value: ExportFormat; label: string; icon: string }[] = React.useMemo(() => [
    { value: 'json', label: 'JSON', icon: 'code' },
    { value: 'csv', label: 'CSV', icon: 'table_chart' },
    { value: 'excel', label: 'Excel', icon: 'grid_on' }
  ], []);

  return (
    <div className="field">
      <div className="control">
        <div className="buttons has-addons is-small">
          {formats.map(({ value, label, icon }) => (
            <button
              key={value}
              className={`button is-small is-size-7 ${selectedFormat === value ? 'is-primary' : 'is-outlined'}`}
              onClick={() => onFormatChange(value)}
              disabled={disabled}
              title={`Export as ${label}`}
            >
              <span className="icon is-small">
                <i className="material-icons is-size-7">{icon}</i>
              </span>
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
});

ExportFormatSelector.displayName = 'ExportFormatSelector';

export default ExportFormatSelector; 