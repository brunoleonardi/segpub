import { useParams } from 'react-router-dom';
import { ControlTable } from '../../components/ControlTable';
import { useTheme } from '../../contexts/ThemeContext';

export const ControlTablePage = () => {
  const { section } = useParams();
  const { isDarkMode } = useTheme();

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-[#353535]' : 'bg-[#EFF4FA]'}`}>
      <ControlTable title={section || ''} />
    </div>
  );
};