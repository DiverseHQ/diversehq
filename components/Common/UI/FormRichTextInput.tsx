import React, { useEffect } from 'react'
import {
  $convertFromMarkdownString,
  $convertToMarkdownString,
  TEXT_FORMAT_TRANSFORMERS
} from '@lexical/markdown'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $getRoot } from 'lexical'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import NewMentionsPlugin from '../../Lexical/Plugins/MentionsPlugin'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { HashtagPlugin } from '@lexical/react/LexicalHashtagPlugin'
import LexicalAutoLinkPlugin from '../../Lexical/Plugins/LexicalAutoLinkPlugin'
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin'

/* eslint-disable */

interface Props {
  label: string
  className?: string
  startingValue: string
  setContent: (content: string) => void
  placeholder: string
}

const FormRichTextInput = ({
  label,
  className = '',
  startingValue,
  setContent,
  placeholder
}: Props) => {
  const TRANSFORMERS = [...TEXT_FORMAT_TRANSFORMERS]
  const [editor] = useLexicalComposerContext()
  useEffect(() => {
    editor?.update(() => {
      $convertFromMarkdownString(startingValue, TRANSFORMERS)
    })
    return () => {
      editor?.update(() => {
        $getRoot().clear()
      })
    }
  }, [])

  return (
    <label>
      <div
        className={`border rounded-xl border-s-border mx-4 py-2 px-4 my-4 text-p-text bg-s-bg ${className}`}
      >
        <div className="pb-2">{label}</div>
        <div className="relative">
          {/* todo toolbar for rich text editor */}
          {/* <ToolbarPlugin /> */}
          <RichTextPlugin
            contentEditable={
              <ContentEditable className="block min-h-[70px] text-p-text overflow-auto max-h-[250px] outline-none bg-s-bg" />
            }
            placeholder={
              <div className="text-gray-400 absolute top-0 left-0 pointer-events-none whitespace-nowrap">
                <div>{placeholder}</div>
                <div className="text-xs">
                  Tip: type @ and profile handle to tag them{' '}
                </div>
              </div>
            }
            ErrorBoundary={() => <div>Something went wrong !</div>}
          />
          <OnChangePlugin
            onChange={(editorState) => {
              editorState.read(() => {
                const markdown = $convertToMarkdownString(TRANSFORMERS)
                setContent(markdown)
              })
            }}
          />
          <NewMentionsPlugin />
          <HistoryPlugin />
          <HashtagPlugin />
          <LexicalAutoLinkPlugin />
          <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
        </div>
      </div>
    </label>
  )
}

export default FormRichTextInput
