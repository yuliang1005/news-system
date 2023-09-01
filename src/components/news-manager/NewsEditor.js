import React, { useEffect, useState } from 'react'
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from 'draftjs-to-html';
import { EditorState, convertToRaw, ContentState } from 'draft-js'
import htmlToDraft from 'html-to-draftjs'
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

export default function NewsEditor(props) {
    const [editorState, setEditorState] = useState('')
    useEffect(() => {
        const html = props.content
        if(html===undefined) return
        const contentBlock = htmlToDraft(html);
        if (contentBlock) {
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
            const editorState = EditorState.createWithContent(contentState);
            setEditorState(editorState)
        }
    }, [props.content])
    return (
        <>
            <Editor
                editorState={editorState}
                toolbarClassName="toolbarClassName"
                wrapperClassName="wrapperClassName"
                editorClassName="editorClassName"
                onEditorStateChange={(editorState) =>
                    setEditorState(editorState)
                }
                onBlur={() => {
                    props.getContent(draftToHtml(convertToRaw(editorState.getCurrentContent())))
                }}
            />
        </>
    )
}
