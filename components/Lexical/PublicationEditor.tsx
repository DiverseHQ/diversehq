import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import {
  $convertToMarkdownString,
  TEXT_FORMAT_TRANSFORMERS
} from '@lexical/markdown'
import React from 'react'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { HashtagPlugin } from '@lexical/react/LexicalHashtagPlugin'
import LexicalAutoLinkPlugin from './Plugins/LexicalAutoLinkPlugin'
import ImagesPlugin from './Plugins/ImagesPlugin'
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin'
import NewMentionsPlugin from './Plugins/MentionsPlugin'

/* eslint-disable */

interface Props {
  setContent: (content: string) => void
  onPaste?: (files: File[]) => void
}
const TRANSFORMERS = [...TEXT_FORMAT_TRANSFORMERS]
const PublicationEditor = ({ setContent, onPaste }: Props) => {
  return (
    <div className="relative">
      {/* todo toolbar for rich text editor */}
      {/* <ToolbarPlugin /> */}
      <RichTextPlugin
        contentEditable={
          <ContentEditable className="block min-h-[70px] text-p-text overflow-auto px-4 py-2 border border-s-border rounded-xl m-4 max-h-[300px] sm:max-h-[350px] outline-none bg-s-bg" />
        }
        placeholder={
          <div className="px-4 text-gray-400 absolute top-2 left-4 pointer-events-none whitespace-nowrap">
            <div>What's this about...? (optional | Can leave empty)</div>
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
      <ImagesPlugin onPaste={onPaste} />
      <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
    </div>
  )
}

export default PublicationEditor
