import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import {
  Bold as BoldIcon,
  Italic as ItalicIcon,
  Underline as UnderlineIcon,
  Heading1 as Heading1Icon,
  Heading2 as Heading2Icon,
  List as ListIcon,
  ListOrdered as ListOrderedIcon,
  Quote as QuoteIcon,
  Link as LinkIcon,
  Image as ImageIcon,
  Undo as UndoIcon,
  Redo as RedoIcon,
} from 'lucide-react';
import { useEffect } from 'react';

interface TiptapEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export function TiptapEditor({ content, onChange }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-[#DE5D8F] underline hover:text-[#CA5582] cursor-pointer',
        },
      }),
      Image.configure({
        inline: false,
        HTMLAttributes: {
          class: 'max-w-full rounded-[12px] my-4 shadow-sm object-cover',
        },
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class:
          'tiptap-content w-full min-h-[360px] p-5 outline-none font-serif text-[#1A1C1C] text-[16px] leading-[28px] focus:outline-none',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Sync external content update (e.g. when loading article to edit)
  useEffect(() => {
    if (editor && content && editor.getHTML() !== content) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) {
    return (
      <div className="w-full min-h-[360px] p-5 flex items-center justify-center text-gray-400 font-serif">
        กำลังโหลด Editor...
      </div>
    );
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('ใส่ URL ลิงก์:', previousUrl || 'https://');
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const addImage = () => {
    const url = window.prompt('ใส่ URL รูปภาพ (เช่น https://example.com/image.jpg):');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <div className="w-full flex flex-col bg-white rounded-[16px] border border-[#DFDFE0] shadow-xs overflow-hidden">
      {/* ── Toolbar ── */}
      <div className="flex items-center gap-1 p-2.5 border-b border-[#DFDFE0] bg-[#F7F8F9] flex-wrap select-none">
        {/* Bold */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`w-8 h-8 rounded-[6px] flex items-center justify-center transition-colors border-none cursor-pointer ${
            editor.isActive('bold')
              ? 'bg-[#FCEFF4] text-[#DE5D8F]'
              : 'hover:bg-[#ECECEC] text-[#404041] bg-transparent'
          }`}
          title="ตัวหนา (Ctrl+B)"
        >
          <BoldIcon size={16} />
        </button>

        {/* Italic */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`w-8 h-8 rounded-[6px] flex items-center justify-center transition-colors border-none cursor-pointer ${
            editor.isActive('italic')
              ? 'bg-[#FCEFF4] text-[#DE5D8F]'
              : 'hover:bg-[#ECECEC] text-[#404041] bg-transparent'
          }`}
          title="ตัวเอียง (Ctrl+I)"
        >
          <ItalicIcon size={16} />
        </button>

        {/* Underline */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`w-8 h-8 rounded-[6px] flex items-center justify-center transition-colors border-none cursor-pointer ${
            editor.isActive('underline')
              ? 'bg-[#FCEFF4] text-[#DE5D8F]'
              : 'hover:bg-[#ECECEC] text-[#404041] bg-transparent'
          }`}
          title="ขีดเส้นใต้ (Ctrl+U)"
        >
          <UnderlineIcon size={16} />
        </button>

        <div className="w-[1px] h-5 bg-[#DFDFE0] mx-1" />

        {/* Heading 1 */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`px-2 h-8 rounded-[6px] flex items-center justify-center transition-colors border-none cursor-pointer font-bold text-[13px] ${
            editor.isActive('heading', { level: 1 })
              ? 'bg-[#FCEFF4] text-[#DE5D8F]'
              : 'hover:bg-[#ECECEC] text-[#404041] bg-transparent'
          }`}
          title="หัวข้อใหญ่ (Heading 1)"
        >
          <Heading1Icon size={16} />
        </button>

        {/* Heading 2 */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`px-2 h-8 rounded-[6px] flex items-center justify-center transition-colors border-none cursor-pointer font-bold text-[13px] ${
            editor.isActive('heading', { level: 2 })
              ? 'bg-[#FCEFF4] text-[#DE5D8F]'
              : 'hover:bg-[#ECECEC] text-[#404041] bg-transparent'
          }`}
          title="หัวข้อย่อย (Heading 2)"
        >
          <Heading2Icon size={16} />
        </button>

        <div className="w-[1px] h-5 bg-[#DFDFE0] mx-1" />

        {/* Bullet List */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`w-8 h-8 rounded-[6px] flex items-center justify-center transition-colors border-none cursor-pointer ${
            editor.isActive('bulletList')
              ? 'bg-[#FCEFF4] text-[#DE5D8F]'
              : 'hover:bg-[#ECECEC] text-[#404041] bg-transparent'
          }`}
          title="รายการแบบจุด (Bullet List)"
        >
          <ListIcon size={16} />
        </button>

        {/* Numbered List */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`w-8 h-8 rounded-[6px] flex items-center justify-center transition-colors border-none cursor-pointer ${
            editor.isActive('orderedList')
              ? 'bg-[#FCEFF4] text-[#DE5D8F]'
              : 'hover:bg-[#ECECEC] text-[#404041] bg-transparent'
          }`}
          title="รายการแบบลำดับเลข (Numbered List)"
        >
          <ListOrderedIcon size={16} />
        </button>

        {/* Blockquote */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`w-8 h-8 rounded-[6px] flex items-center justify-center transition-colors border-none cursor-pointer ${
            editor.isActive('blockquote')
              ? 'bg-[#FCEFF4] text-[#DE5D8F]'
              : 'hover:bg-[#ECECEC] text-[#404041] bg-transparent'
          }`}
          title="คำคม / ข้อความอ้างอิง (Blockquote)"
        >
          <QuoteIcon size={16} />
        </button>

        <div className="w-[1px] h-5 bg-[#DFDFE0] mx-1" />

        {/* Link */}
        <button
          type="button"
          onClick={setLink}
          className={`w-8 h-8 rounded-[6px] flex items-center justify-center transition-colors border-none cursor-pointer ${
            editor.isActive('link')
              ? 'bg-[#FCEFF4] text-[#DE5D8F]'
              : 'hover:bg-[#ECECEC] text-[#404041] bg-transparent'
          }`}
          title="แทรกลิงก์"
        >
          <LinkIcon size={16} />
        </button>

        {/* Image */}
        <button
          type="button"
          onClick={addImage}
          className="w-8 h-8 rounded-[6px] flex items-center justify-center hover:bg-[#ECECEC] text-[#404041] border-none bg-transparent cursor-pointer transition-colors"
          title="แทรกรูปภาพจาก URL"
        >
          <ImageIcon size={16} />
        </button>

        <div className="w-[1px] h-5 bg-[#DFDFE0] mx-1" />

        {/* Undo */}
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="w-8 h-8 rounded-[6px] flex items-center justify-center hover:bg-[#ECECEC] text-[#404041] border-none bg-transparent cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="เลิกทำ (Undo)"
        >
          <UndoIcon size={15} />
        </button>

        {/* Redo */}
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="w-8 h-8 rounded-[6px] flex items-center justify-center hover:bg-[#ECECEC] text-[#404041] border-none bg-transparent cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="ทำซ้ำ (Redo)"
        >
          <RedoIcon size={15} />
        </button>
      </div>

      {/* ── Editor Body ── */}
      <div className="w-full min-h-[360px] bg-white cursor-text">
        <EditorContent editor={editor} />
      </div>

      {/* Editor CSS styles for ProseMirror content */}
      <style>{`
        .tiptap-content p {
          margin-bottom: 1rem;
        }
        .tiptap-content h1 {
          font-size: 1.75rem;
          font-weight: 700;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
          color: #1A1C1C;
        }
        .tiptap-content h2 {
          font-size: 1.35rem;
          font-weight: 700;
          margin-top: 1.25rem;
          margin-bottom: 0.5rem;
          color: #1A1C1C;
        }
        .tiptap-content ul {
          list-style-type: disc;
          padding-left: 1.5rem;
          margin-bottom: 1rem;
        }
        .tiptap-content ol {
          list-style-type: decimal;
          padding-left: 1.5rem;
          margin-bottom: 1rem;
        }
        .tiptap-content blockquote {
          border-left: 3px solid #DE5D8F;
          padding-left: 1rem;
          font-style: italic;
          color: #555;
          margin: 1.25rem 0;
          background: #FDF8FA;
          padding: 0.75rem 1rem;
          border-radius: 0 8px 8px 0;
        }
      `}</style>
    </div>
  );
}

