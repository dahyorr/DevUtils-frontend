import { useState, useRef, useEffect } from 'react'
import Editor from "@/components/JsonToYaml/Editor";
import Preview from "@/components/JsonToYaml/Preview";
import { Box } from '@mui/material';
import { OnChange, OnMount, OnValidate, loader } from '@monaco-editor/react'
import yaml from 'js-yaml'
import { editor } from 'monaco-editor'
import { monacoConfig } from '@/helpers/monacoLoaderConfig'
import { useTheme } from '@mui/material/styles';

loader.config(monacoConfig)
const JsonToYamlPage = () => {
  const [editorContent, setEditorContent] = useState("")
  const [editorErrors, setEditorErrors] = useState<string[]>([])
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const previewRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  const theme = useTheme()
  const themeMode = theme.palette.mode

  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor;
  }

  const handleEditorValidation: OnValidate = (markers) => {
    const errors = markers.map(marker => marker.message)
    setEditorErrors(errors)
  }

  const handlePreviewDidMount: OnMount = (editor) => {
    previewRef.current = editor;
  }

  // console.log(editorErrors)

  const handleEditorChange: OnChange = (value) => {
    console.log('change')
    setEditorContent(value || "")
  }

  useEffect(() => {
    if (editorContent && editorErrors.length < 1) {
      try {
        const parsedJson = JSON.parse(editorContent)
        const converted = yaml.dump(parsedJson)
        previewRef.current?.getModel()?.setValue(converted)
      }
      catch (err) {
        // console.log(err)
        return;
      }
    }
  }, [editorContent, editorErrors])

  return (
    <Box sx={{
      height: '100%'
    }}>
      <Box
        sx={{
          maxWidth: '100%',
          height: '100%',
          display: 'flex',
        }}>
        <Editor
          value={editorContent}
          onMount={handleEditorDidMount}
          theme={themeMode === 'light' ? themeMode : 'vs-dark'}
          onChange={handleEditorChange}
          onValidate={handleEditorValidation}
        />
        <Preview
          onMount={handlePreviewDidMount}
          theme={themeMode === 'light' ? themeMode : 'vs-dark'}
        />
      </Box>

    </Box>
  )
}

export default JsonToYamlPage