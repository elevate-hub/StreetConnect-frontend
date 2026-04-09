import { useState } from 'react';
import { Globe, Loader2 } from 'lucide-react';
import { translateText } from '../../api/translate.api';
import { useTranslation } from 'react-i18next';

const TranslateButton = ({ text, onTranslated }) => {
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const handleTranslate = async () => {
    if (!text?.trim()) return;
    setLoading(true);
    try {
      const res = await translateText(text);
      onTranslated(res.data);
    } catch (err) {
      console.error('Translation failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleTranslate}
      disabled={loading || !text?.trim()}
      className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-primary-hover disabled:opacity-50 transition-colors"
    >
      {loading ? <Loader2 size={16} className="animate-spin" /> : <Globe size={16} />}
      {t('onboarding.translate')}
    </button>
  );
};

export default TranslateButton;
