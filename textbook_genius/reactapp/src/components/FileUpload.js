
// import { Button } from '@mui/material';
// const FileUpload = ({ onFileSelect, acceptedFileTypes, label }) => {
//     /**
//      * FileUpload 组件
//      *
//      * 用于上传文件的通用组件。支持指定文件类型和自定义按钮标签。
//      *
//      * Props:
//      * - onFileSelect (function): 文件选择后的回调函数,接受一个文件对象作为参数。
//      * - acceptedFileTypes (string): 接受的文件类型,用于限制文件选择器中可见的文件类型。例如:".pdf,.doc,.docx,.txt"
//      * - label (string): 按钮上的文本标签。
//      *
//      * Usage:
//      * const handleFileSelect = (file) => {
//      *         setFileName(file.name);
//      *     };
//      *
//      * <FileUpload
//      *   onFileSelect={handleFileSelect}
//      *   acceptedFileTypes=".pdf,.doc,.docx,.txt"
//      *   label="Upload Document"
//      * />
//      *
//      * @param {Object} props - 组件的属性对象
//      * @returns {JSX.Element} - FileUpload 组件的 JSX 元素
//      */
//     const handleFileChange = (event) => {
//         const file = event.target.files[0];
//         if (file) {
//             const reader = new FileReader();
//             reader.onload = (e) => {
//                 onFileSelect(e.target.result);
//             };
//             reader.readAsDataURL(file);
//         }
//     };

//     return (
//         <div>
//             <input
//                 accept={acceptedFileTypes}
//                 style={{ display: 'none' }}
//                 id="file-upload"
//                 type="file"
//                 onChange={handleFileChange}
//             />
//             <label htmlFor="file-upload">
//                 <Button variant="contained" color="primary" component="span">
//                     {label}
//                 </Button>
//             </label>
//         </div>
//     );
// };

// export default FileUpload;
import * as React from 'react';
import { useState } from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SparkMD5 from 'spark-md5';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});


const InputFileUpload = ({ onChange }) => {

    
    return (
        <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<CloudUploadIcon />}
        >
            Upload file
            <VisuallyHiddenInput type="file" onChange={onChange} />
        </Button>
    );
};
const CHUNK_SIZE=5;
const UplodadBig=()=>{
    const [file, setFile] = useState(null);
    const [progress, setProgress] = useState(0);

    const calculateFileMD5 = (file) => {
        return new Promise((resolve) => {
          const spark = new SparkMD5.ArrayBuffer();
          const fileReader = new FileReader();
          
          fileReader.onload = (e) => {
            spark.append(e.target.result);
            resolve(spark.end());
          };
          
          fileReader.readAsArrayBuffer(file);
        });
    };
    
    const uploadChunk = async (filename, chunkIndex, chunk,fileMD5) => {
        const formData = new FormData();
        formData.append('filename', filename);
        formData.append('fileMD5', fileMD5);
        formData.append('index', chunkIndex);
        formData.append('chunk', chunk);

        const data=await fetch('/api/upload', {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            body: formData,
          });
    
        // let resp = await axios.post(API_HOST, formData, {
        //   headers: {
        //     'Content-Type': 'multipart/form-data'
        //   }
        // });
        // console.log(resp)
      };

    const upload=async (e)=>{
        const f = e.target.files[0];
        setFile(f)
        if (!f){
            return;
        }
        const filename="";
        const fileMD5 = await calculateFileMD5(file);
        const totalChunks = Math.ceil(file.size / CHUNK_SIZE); // 计算分片总数
        let uploadedChunks = 0; // 已上传的分片数

        for (let i = 0; i < totalChunks; i++) {
            const start = i * CHUNK_SIZE;
            const end = (i + 1) * CHUNK_SIZE;
      
            const chunk = file.slice(start, end);
            await uploadChunk(filename, i, chunk); // 上传分片
            uploadedChunks++;
      
            setProgress((uploadedChunks / totalChunks) * 100); // 更新上传进度
          }


    };

    return (
        <div>
            {InputFileUpload(onchange=upload)}
        </div>


    );

};

export default InputFileUpload;
