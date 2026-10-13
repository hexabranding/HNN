import React, { useState, useRef, useEffect } from 'react';

export default function HtmlEditor({ value = '', onChange, placeholder = 'Full article content...' }) {
  const [isHtmlMode, setIsHtmlMode] = useState(false);
  const editorRef = useRef(null);
  const isInternalUpdate = useRef(false);

  // Synchronize incoming value when changed from outside (e.g. editing an article or reset form)
  useEffect(() => {
    if (editorRef.current && !isHtmlMode) {
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value || '';
      }
    }
  }, [value, isHtmlMode]);

  const handleInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      isInternalUpdate.current = true;
      onChange(html === '<p><br></p>' || html === '<br>' ? '' : html);
    }
  };

  const exec = (command, val = null) => {
    if (isHtmlMode) return;
    editorRef.current?.focus();
    document.execCommand(command, false, val);
    handleInput();
  };

  const handleFormatBlock = (tag) => {
    exec('formatBlock', tag ? `<${tag}>` : '<p>');
  };

  const handleInsertLink = () => {
    if (isHtmlMode) return;
    const url = prompt('Enter link URL (e.g. https://example.com):');
    if (url) {
      exec('createLink', url);
    }
  };

  const handleInsertImage = () => {
    if (isHtmlMode) return;
    const url = prompt('Enter image URL:');
    if (url) {
      exec('insertImage', url);
    }
  };

  const calculateStats = () => {
    const text = (value || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    const words = text ? text.split(/\s+/).length : 0;
    const chars = text.length;
    return { words, chars };
  };

  const stats = calculateStats();

  return (
    <div className="border border-[#dddddd] rounded-lg overflow-hidden bg-white shadow-sm focus-within:border-[#c91f26] transition-colors">
      {/* --- Toolbar --- */}
      <div className="bg-[#f8f9fa] border-b border-[#e5e7eb] px-3 py-2 flex flex-wrap items-center gap-1 sm:gap-1.5 select-none text-[#444444]">
        {/* Heading Style Select */}
        <select
          onChange={(e) => handleFormatBlock(e.target.value)}
          disabled={isHtmlMode}
          className="h-8 px-2 text-xs bg-white border border-[#d1d5db] rounded outline-none cursor-pointer hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          title="Text Style"
        >
          <option value="p">Paragraph</option>
          <option value="h2">Heading 2 (H2)</option>
          <option value="h3">Heading 3 (H3)</option>
          <option value="h4">Heading 4 (H4)</option>
          <option value="blockquote">Quote Block</option>
        </select>

        <span className="w-px h-5 bg-[#e0e0e0] mx-1"></span>

        {/* Text Styles */}
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); exec('bold'); }}
          disabled={isHtmlMode}
          title="Bold (Ctrl+B)"
          className="w-8 h-8 flex items-center justify-center rounded hover:bg-[#e9ecef] active:bg-[#dde2e6] text-[#222222] disabled:opacity-40"
        >
          <i className="bi bi-type-bold font-bold text-sm"></i>
        </button>

        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); exec('italic'); }}
          disabled={isHtmlMode}
          title="Italic (Ctrl+I)"
          className="w-8 h-8 flex items-center justify-center rounded hover:bg-[#e9ecef] active:bg-[#dde2e6] text-[#222222] disabled:opacity-40"
        >
          <i className="bi bi-type-italic text-sm"></i>
        </button>

        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); exec('underline'); }}
          disabled={isHtmlMode}
          title="Underline (Ctrl+U)"
          className="w-8 h-8 flex items-center justify-center rounded hover:bg-[#e9ecef] active:bg-[#dde2e6] text-[#222222] disabled:opacity-40"
        >
          <i className="bi bi-type-underline text-sm"></i>
        </button>

        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); exec('strikeThrough'); }}
          disabled={isHtmlMode}
          title="Strikethrough"
          className="w-8 h-8 flex items-center justify-center rounded hover:bg-[#e9ecef] active:bg-[#dde2e6] text-[#222222] disabled:opacity-40"
        >
          <i className="bi bi-type-strikethrough text-sm"></i>
        </button>

        <span className="w-px h-5 bg-[#e0e0e0] mx-1"></span>

        {/* Alignment */}
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); exec('justifyLeft'); }}
          disabled={isHtmlMode}
          title="Align Left"
          className="w-8 h-8 flex items-center justify-center rounded hover:bg-[#e9ecef] active:bg-[#dde2e6] text-[#222222] disabled:opacity-40"
        >
          <i className="bi bi-text-left text-sm"></i>
        </button>

        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); exec('justifyCenter'); }}
          disabled={isHtmlMode}
          title="Align Center"
          className="w-8 h-8 flex items-center justify-center rounded hover:bg-[#e9ecef] active:bg-[#dde2e6] text-[#222222] disabled:opacity-40"
        >
          <i className="bi bi-text-center text-sm"></i>
        </button>

        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); exec('justifyRight'); }}
          disabled={isHtmlMode}
          title="Align Right"
          className="w-8 h-8 flex items-center justify-center rounded hover:bg-[#e9ecef] active:bg-[#dde2e6] text-[#222222] disabled:opacity-40"
        >
          <i className="bi bi-text-right text-sm"></i>
        </button>

        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); exec('justifyFull'); }}
          disabled={isHtmlMode}
          title="Justify"
          className="w-8 h-8 flex items-center justify-center rounded hover:bg-[#e9ecef] active:bg-[#dde2e6] text-[#222222] disabled:opacity-40"
        >
          <i className="bi bi-justify text-sm"></i>
        </button>

        <span className="w-px h-5 bg-[#e0e0e0] mx-1"></span>

        {/* Lists & Blocks */}
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); exec('insertUnorderedList'); }}
          disabled={isHtmlMode}
          title="Bullet List"
          className="w-8 h-8 flex items-center justify-center rounded hover:bg-[#e9ecef] active:bg-[#dde2e6] text-[#222222] disabled:opacity-40"
        >
          <i className="bi bi-list-ul text-sm"></i>
        </button>

        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); exec('insertOrderedList'); }}
          disabled={isHtmlMode}
          title="Numbered List"
          className="w-8 h-8 flex items-center justify-center rounded hover:bg-[#e9ecef] active:bg-[#dde2e6] text-[#222222] disabled:opacity-40"
        >
          <i className="bi bi-list-ol text-sm"></i>
        </button>

        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); exec('insertHorizontalRule'); }}
          disabled={isHtmlMode}
          title="Horizontal Divider"
          className="w-8 h-8 flex items-center justify-center rounded hover:bg-[#e9ecef] active:bg-[#dde2e6] text-[#222222] disabled:opacity-40"
        >
          <i className="bi bi-hr text-sm"></i>
        </button>

        <span className="w-px h-5 bg-[#e0e0e0] mx-1"></span>

        {/* Insert Link & Image */}
        <button
          type="button"
          onClick={handleInsertLink}
          disabled={isHtmlMode}
          title="Insert Link"
          className="w-8 h-8 flex items-center justify-center rounded hover:bg-[#e9ecef] active:bg-[#dde2e6] text-[#222222] disabled:opacity-40"
        >
          <i className="bi bi-link-45deg text-sm"></i>
        </button>

        <button
          type="button"
          onClick={handleInsertImage}
          disabled={isHtmlMode}
          title="Insert Image by URL"
          className="w-8 h-8 flex items-center justify-center rounded hover:bg-[#e9ecef] active:bg-[#dde2e6] text-[#222222] disabled:opacity-40"
        >
          <i className="bi bi-image text-sm"></i>
        </button>

        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); exec('removeFormat'); }}
          disabled={isHtmlMode}
          title="Clear Formatting"
          className="w-8 h-8 flex items-center justify-center rounded hover:bg-[#e9ecef] active:bg-[#dde2e6] text-[#222222] disabled:opacity-40"
        >
          <i className="bi bi-eraser text-sm"></i>
        </button>

        {/* Undo / Redo */}
        <span className="w-px h-5 bg-[#e0e0e0] mx-1"></span>
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); exec('undo'); }}
          disabled={isHtmlMode}
          title="Undo (Ctrl+Z)"
          className="w-8 h-8 flex items-center justify-center rounded hover:bg-[#e9ecef] active:bg-[#dde2e6] text-[#222222] disabled:opacity-40"
        >
          <i className="bi bi-arrow-counterclockwise text-sm"></i>
        </button>
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); exec('redo'); }}
          disabled={isHtmlMode}
          title="Redo (Ctrl+Y)"
          className="w-8 h-8 flex items-center justify-center rounded hover:bg-[#e9ecef] active:bg-[#dde2e6] text-[#222222] disabled:opacity-40"
        >
          <i className="bi bi-arrow-clockwise text-sm"></i>
        </button>

        {/* HTML Source Code Mode Toggle */}
        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            onClick={() => setIsHtmlMode(!isHtmlMode)}
            title={isHtmlMode ? 'Switch to Visual Editor' : 'Switch to Raw HTML Code'}
            className={`px-2.5 py-1 text-xs font-semibold rounded flex items-center gap-1.5 transition-colors ${
              isHtmlMode
                ? 'bg-[#c91f26] text-white shadow-sm'
                : 'bg-white border border-[#d1d5db] hover:bg-[#f3f4f6] text-[#374151]'
            }`}
          >
            <i className={`bi ${isHtmlMode ? 'bi-eye' : 'bi-code-slash'}`}></i>
            <span>{isHtmlMode ? 'Visual' : 'HTML Code'}</span>
          </button>
        </div>
      </div>

      {/* --- Editor Workspace --- */}
      <div className="relative min-h-[240px]">
        {isHtmlMode ? (
          /* Raw HTML View */
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="<p>Enter raw HTML content here...</p>"
            rows={12}
            className="w-full p-4 font-mono text-xs text-[#222222] bg-[#fdfdfd] border-none outline-none leading-relaxed resize-y"
            spellCheck={false}
          />
        ) : (
          /* Rich WYSIWYG Visual View */
          <div
            ref={editorRef}
            contentEditable
            onInput={handleInput}
            onBlur={handleInput}
            data-placeholder={placeholder}
            className="p-4 min-h-[240px] max-h-[500px] overflow-y-auto outline-none text-[#222222] text-sm leading-relaxed prose max-w-none focus:outline-none empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400 empty:before:pointer-events-none"
            style={{ minHeight: '240px' }}
          />
        )}
      </div>

      {/* --- Footer Status Bar --- */}
      <div className="bg-[#f8f9fa] border-t border-[#e5e7eb] px-3 py-1.5 flex items-center justify-between text-[11px] text-[#6b7280]">
        <div className="flex items-center gap-3">
          <span>
            Mode: <strong className="text-[#374151]">{isHtmlMode ? 'Raw HTML' : 'Visual WYSIWYG'}</strong>
          </span>
          <span className="hidden sm:inline">|</span>
          <span className="hidden sm:inline">
            Supports rich formatting, headings, lists, quotes, and links
          </span>
        </div>
        <div className="flex items-center gap-3 font-medium">
          <span>{stats.words} words</span>
          <span>{stats.chars} chars</span>
        </div>
      </div>
    </div>
  );
}
