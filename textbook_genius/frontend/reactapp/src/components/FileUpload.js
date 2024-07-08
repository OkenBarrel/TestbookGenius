import React, { useState } from 'react';
import { Button } from '@mui/material';


const FileUpload = ({ onFileSelect, acceptedFileTypes, label }) => {
    /**
     * FileUpload 组件
     *
     * 用于上传文件的通用组件。支持指定文件类型和自定义按钮标签。
     *
     * Props:
     * - onFileSelect (function): 文件选择后的回调函数,接受一个文件对象作为参数。
     * - acceptedFileTypes (string): 接受的文件类型,用于限制文件选择器中可见的文件类型。例如:".pdf,.doc,.docx,.txt"
     * - label (string): 按钮上的文本标签。
     *
     * Usage:
     * const handleFileSelect = (file) => {
     *         setFileName(file.name);
     *     };
     *
     * <FileUpload
     *   onFileSelect={handleFileSelect}
     *   acceptedFileTypes=".pdf,.doc,.docx,.txt"
     *   label="Upload Document"
     * />
     *
     * @param {Object} props - 组件的属性对象
     * @returns {JSX.Element} - FileUpload 组件的 JSX 元素
     */
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                onFileSelect(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div>
            <input
                accept={acceptedFileTypes}
                style={{ display: 'none' }}
                id="file-upload"
                type="file"
                onChange={handleFileChange}
            />
            <label htmlFor="file-upload">
                <Button variant="contained" color="primary" component="span">
                    {label}
                </Button>
            </label>
        </div>
    );
};

export default FileUpload;