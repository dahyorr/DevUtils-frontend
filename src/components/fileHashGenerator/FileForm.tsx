import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Stack from '@mui/material/Stack';
import Fab from '@mui/material/Fab';
import ArrowForwardIcon  from '@mui/icons-material/Code';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import FileUpload from "./FileUpload";
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { uploadFile, initiateHashing } from "@/api";
import { useMainSpinner } from "@/hooks";
import { HashType, HashRequest } from '@/types';

const hashTypes: HashType[] = ['sha256', 'md5']

const FileForm = () => {
    const [files, setFiles] = useState<File[]>([])
    const [errors, setErrors] = useState<{[key: string]: string}>({})
    const [selectedHashType, setSelectedHashType] = useState<HashType[]>([])
    const [snackBarError, setSnackBarError] = useState({
        message: "",
        open: false
    })

    const [showSpinner, hideSpinner] = useMainSpinner()
    const navigate = useNavigate();

    const showErrorSnackbar = (message: string) => {
        setSnackBarError({
            message,
            open: true
        })
    }

    const closeErrorSnackbar = () => {
        setSnackBarError({
            message: '',
            open: false
        })
    }

    useEffect(() => {
        if(errors.files){
            showErrorSnackbar(errors.files)
        }
    }, [errors])
    
    const handleHashChange = (event: SelectChangeEvent<typeof selectedHashType>) => {
        const {value} = event.target
        setSelectedHashType(
            typeof value === 'string' 
            ? value.split(',') as HashType[]
            : value,
        );
    };

    const handleFileSelect = (files: File[]) => {
        setFiles(files)
    }

    const clearFiles = () => {
        setFiles([])
    }

    const validate = () => {
        const validationErrors: {[key: string]: string} = {}
        if(selectedHashType.length < 1){
            validationErrors.hashType = "Select a hash type"
        }
        if(files.length < 1){
            validationErrors.files = "You must upload a file"
        }
        setErrors(validationErrors)
        return Object.keys(validationErrors).length < 1
    }

    const onSubmit = async () => {
        if(validate()){
            showSpinner()
            try{
                const {data} = await uploadFile(files[0])
                const hashRequest: HashRequest = {
                    fileId: data.fileId,
                    hashTypes: selectedHashType
                }
                await initiateHashing(hashRequest)
                navigate(`./${data.fileId}`);
                hideSpinner()
            }
            catch(err){
                if (err instanceof Error) {
                    console.log(err.message)
                    hideSpinner()
                    showErrorSnackbar(err.message || 'An error occured')
                }
            }
        }
        return;
    }

    return (
        <Stack 
        // direction={'row'} 
        spacing={2} 
        sx={{
        alignItems: 'center',
        justifyContent: 'space-evenly'
        }}>

        <FileUpload 
            onChange={handleFileSelect} 
            selectedFiles={files} 
            clearFiles={clearFiles}
            sizeLimit={20971520}
            disableDropzone={false}
        />

        <Stack sx={{
            alignItems: 'center',
        }}>
            <FormControl variant="standard" sx={{ m: 3, mb: 5, minWidth: 200 }} error={Boolean(errors.hashType)}>
            <InputLabel>Hash Type</InputLabel>
            <Select
                value={selectedHashType}
                onChange={handleHashChange}
                label="Hash Type"
                renderValue={(selected) => selected.join(', ')}
                multiple
                name="hashType"
            >
                {hashTypes.map(item => {
                    const label = item.toUpperCase()
                    return (
                        <MenuItem key={item} value={item}>
                            <Checkbox checked={selectedHashType.indexOf(item) > -1} />
                            <ListItemText primary={label} />
                        </MenuItem>
                    )
                })}
            </Select>
            {errors.hashType && <FormHelperText>{errors.hashType}</FormHelperText>}
            </FormControl>

            <Fab size="large" color="primary" aria-label="add" onClick={onSubmit}>
            <ArrowForwardIcon  />
            </Fab>
        </Stack>
            
            <Snackbar 
                open={snackBarError.open} 
                autoHideDuration={6000} 
                onClose={closeErrorSnackbar}
            >
                <Alert 
                    onClose={closeErrorSnackbar} 
                    severity="error" 
                    sx={{ width: '100%' }}
                    elevation={6}
                    variant="filled"
                >
                    {snackBarError.message}
                </Alert>
            </Snackbar>
        </Stack> 
    )
};

export default FileForm;
