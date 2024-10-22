/* eslint-disable no-unused-vars */
import DropzoneColumnPreview from 'components/dropzone/DropzoneColumnPreview';
import React, { useCallback, useEffect, useState } from 'react';
import Dropzone, { defaultClassNames } from 'react-dropzone-uploader';
import 'react-dropzone-uploader/dist/styles.css';

const DetailImage = () => {
  const [files, setFiles] = useState([]);
  const images = [];


  const loadFile = (path) => {
    return new Promise((resolve, reject) => {
      fetch(path).then((res) => {
        res.arrayBuffer().then((buf) => {
          return resolve(new File([buf], 'images.jpg', { type: 'image/jpeg' }));
        });
      });
    });
  };

  const loadFiles = useCallback(() => {
    const promises = images.map((path) => {
      return loadFile(path);
    });
    Promise.all(promises).then((newFiles) => setFiles(newFiles));
  }, [images]);

  useEffect(() => {
    loadFiles();
    return () => setFiles([]);
  }, [loadFiles]);

  const getUploadParams = () => ({ url: 'https://httpbin.org/post' });

  const onChangeStatus = () => {
  };

  return (
    <Dropzone
      initialFiles={files}
      getUploadParams={getUploadParams}
      PreviewComponent={DropzoneColumnPreview}
      submitButtonContent={null}
      accept="image/*"
      submitButtonDisabled
      SubmitButtonComponent={null}
      inputWithFilesContent={null}
      onChangeStatus={onChangeStatus}
      classNames={{
        inputLabelWithFiles: defaultClassNames.inputLabel,
        dropzone: `${defaultClassNames.dropzone} row g-2 row-cols-1`,
      }}
      inputContent="Drop Files"
    />
  );
};

export default DetailImage;
