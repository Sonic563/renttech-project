  import React, { useMemo, useState } from 'react';
  import { useImage } from '../hooks/UseImage';
  import './ImageUpload.css';

  export default function ImageUpload({ value, onImageUploaded, onError }) {

  const { uploadImage, deleteImage } = useImage();
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [uploaded, setUploaded] = useState(false);

    const currentImageUrl = value?.imageUrl || null;
    const currentFileName = value?.fileName || null;

    const displayName = useMemo(() => {
      if (file?.name) return file.name;
      if (currentFileName) return currentFileName;
      if (currentImageUrl) return 'Jelenlegi kép beállítva';
      return 'Nincs kiválasztott kép';
    }, [file, currentFileName, currentImageUrl]);

    const displayPreview = useMemo(() => {
      return preview || currentImageUrl || null;
    }, [preview, currentImageUrl]);

const MAX_FILE_SIZE = 5 * 1024 * 1024

const handleFileChange = (e) => {
  const selected = e.target.files && e.target.files[0] ? e.target.files[0] : null;

  if (selected && selected.size > MAX_FILE_SIZE) {
  onError && onError('A kép túl nagy! Maximum 5 MB lehet.');
  e.target.value = '';
  setFile(null);
  setPreview(null);
  return;
}

  setFile(selected);
  setUploaded(false);

  if (selected) {
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target.result);
    reader.readAsDataURL(selected);
  } else {
    setPreview(null);
  }
};
   const handleUpload = async () => {
  if (!file) {
    onError && onError('Válassz ki egy képet feltöltés előtt!');
    return;
  }

  try {
    setLoading(true);
    const result = await uploadImage(file, 'Eszköz képe', 'admin');
    setLoading(false);

    if (!result.success) {
      onError && onError(result.error || 'Hiba a feltöltéskor');
      return;
    }

    const img = result.image; 

    onImageUploaded &&
      onImageUploaded({
        id: img.id,
        imageUrl: `http://localhost:8080${img.imageUrl}`, 
        fileName: file.name,
      });

    setUploaded(true);
  } catch (err) {
    setLoading(false);
    onError && onError('Váratlan hiba a feltöltéskor');
  }
};

    const handleClearSelection = () => {
      setFile(null);
      setPreview(null);
      setUploaded(false);
    };

    

const handleRemoveImage = async () => {
  try {
    if (value?.imageId) {
      const result = await deleteImage(value.imageId);

      if (!result.success) {
        onError && onError("Kép törlése sikertelen");
        return;
      }
    }

    setFile(null);
    setPreview(null);
    setUploaded(false);

    onImageUploaded &&
      onImageUploaded({
        id: null,
        imageUrl: null,
        fileName: null,
      });
  } catch (err) {
    console.error(err);
    onError && onError("Kép törlése sikertelen");
  }
};
    return (
      <div className="iu-root">
        <div className="iu-header">
          <div className="iu-title">Kép</div>
          <div className="iu-subtitle">{displayName}</div>
        </div>

        <div className="iu-body">
          <div className="iu-preview">
            {displayPreview ? (
              <img className="iu-previewImg" src={displayPreview} alt="Kép előnézet" />
            ) : (
              <div className="iu-previewEmpty">Nincs kép</div>
            )}
          </div>

          <div className="iu-actions">
            <label className="iu-pickButton">
              Kép kiválasztása
              <input
                className="iu-fileInput"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
            </label>

            <div className="iu-actionRow">
              <button
                type="button"
                className="iu-btn iu-btnPrimary"
                onClick={handleUpload}
                disabled={loading || !file}
              >
                {loading ? 'Feltöltés...' : uploaded ? 'Feltöltve' : 'Feltöltés'}
              </button>

              <button
                type="button"
                className="iu-btn"
                onClick={handleClearSelection}
                disabled={!file && !preview}
              >
                Kiválasztás törlése
              </button>

              <button
                type="button"
                className="iu-btn iu-btnDanger"
                onClick={handleRemoveImage}
                disabled={!currentImageUrl && !preview}
              >
                Kép eltávolítása
              </button>
            </div>

            <div className="iu-hint">
              Feltöltés után nyomj <b>Mentés</b>-t is, hogy az eszközhöz el legyen mentve.
            </div>
          </div>
        </div>
      </div>
    );
  }