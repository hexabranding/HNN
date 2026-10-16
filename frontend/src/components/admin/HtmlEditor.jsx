import React, { useState, useRef, useEffect, useCallback } from 'react';

export default function HtmlEditor({ value = '', onChange, placeholder = 'Full article content...' }) {
  const [isHtmlMode, setIsHtmlMode] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState('p');
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const editorRef = useRef(null);
  const isInternalUpdate = useRef(false);
  const savedRangeRef = useRef(null);

  // Configure browser execCommand preferences on mount
  useEffect(() => {
    try {
      document.execCommand('defaultParagraphSeparator', false, 'p');
      document.execCommand('styleWithCSS', false, false);
    } catch {}
  }, []);

  // Save active selection range inside contentEditable
  const saveSelection = useCallback(() => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0 && editorRef.current) {
      const range = sel.getRangeAt(0);
      if (editorRef.current.contains(range.commonAncestorContainer)) {
        savedRangeRef.current = range.cloneRange();
      }
    }
  }, []);

  // Restore saved selection range
  const restoreSelection = useCallback(() => {
    if (!savedRangeRef.current) return;
    const sel = window.getSelection();
    if (sel) {
      sel.removeAllRanges();
      sel.addRange(savedRangeRef.current);
    }
  }, []);

  // Detect active formatting states (bold, italic, underline, block format)
  const updateActiveFormat = useCallback(() => {
    saveSelection();
    try {
      setIsBold(Boolean(document.queryCommandState('bold')));
      setIsItalic(Boolean(document.queryCommandState('italic')));
      setIsUnderline(Boolean(document.queryCommandState('underline')));

      const block = document.queryCommandValue('formatBlock');
      if (block) {
        const clean = block.toLowerCase().replace(/[<>]/g, '');
        if (['p', 'h2', 'h3', 'h4', 'blockquote'].includes(clean)) {
          setSelectedFormat(clean);
          return;
        }
      }
      setSelectedFormat('p');
    } catch {
      setSelectedFormat('p');
    }
  }, [saveSelection]);

  // Synchronize incoming value when changed from outside (e.g. editing an article or reset form)
  useEffect(() => {
    // If the update originated from user typing inside this editor, don't reset innerHTML (prevents cursor jump)
    if (isInternalUpdate.current) {
      isInternalUpdate.current = false;
      return;
    }
    if (editorRef.current && !isHtmlMode) {
      const currentHtml = editorRef.current.innerHTML;
      const targetHtml = value || '';
      if (currentHtml !== targetHtml) {
        editorRef.current.innerHTML = targetHtml;
        // If empty, ensure truly empty so placeholder displays
        const stripped = targetHtml.replace(/<[^>]*>/g, '').trim();
        if (!stripped) {
          editorRef.current.innerHTML = '';
        }
      }
    }
  }, [value, isHtmlMode]);

  const handleInput = () => {
    if (editorRef.current) {
      let html = editorRef.current.innerHTML;
      const stripped = html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();

      // If the editor is effectively empty (e.g. just <br> or <p><br></p>), clear it completely so CSS placeholder appears
      if (!stripped && (html === '<p><br></p>' || html === '<br>' || html === '<p></p>' || !html.trim())) {
        editorRef.current.innerHTML = '';
        html = '';
      }

      isInternalUpdate.current = true;
      if (onChange) {
        onChange(html);
      }
      saveSelection();
    }
  };

  const exec = (command, val = null) => {
    if (isHtmlMode) return;
    restoreSelection();
    editorRef.current?.focus();
    try {
      document.execCommand(command, false, val);
    } catch (e) {
      console.warn('execCommand failed:', e);
    }
    handleInput();
    updateActiveFormat();
  };

  const handleFormatBlock = (tag) => {
    if (isHtmlMode) return;
    restoreSelection();
    editorRef.current?.focus();
    const formatTag = tag ? `<${tag}>` : '<p>';
    exec('formatBlock', formatTag);
    setSelectedFormat(tag || 'p');
  };

  const handleInsertLink = () => {
    if (isHtmlMode) return;
    saveSelection();
    const url = prompt('Enter link URL (e.g. https://example.com):');
    if (url) {
      restoreSelection();
      editorRef.current?.focus();
      exec('createLink', url);
    }
  };

  const handleInsertImage = () => {
    if (isHtmlMode) return;
    saveSelection();
    const url = prompt('Enter image URL:');
    if (url) {
      restoreSelection();
      editorRef.current?.focus();
      exec('insertImage', url);
    }
  };

  // Clean Paste handler: Strips messy MS Word styles, script tags, and junk styling
  const handlePaste = (e) => {
    e.preventDefault();
    const text = (e.clipboardData || window.clipboardData).getData('text/plain');
    if (document.queryCommandSupported && document.queryCommandSupported('insertText')) {
      document.execCommand('insertText', false, text);
    } else {
      const sel = window.getSelection();
      if (!sel || !sel.rangeCount) return;
      const range = sel.getRangeAt(0);
      range.deleteContents();
      const textNode = document.createTextNode(text);
      range.insertNode(textNode);
      range.setStartAfter(textNode);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
    }
    handleInput();
  };

  const calculateStats = () => {
    const text = (value || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    const words = text ? text.split(/\s+/).filter(Boolean).length : 0;
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
          value={selectedFormat}
          onFocus={saveSelection}
          onMouseDown={saveSelection}
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
          className={`w-8 h-8 flex items-center justify-center rounded transition-colors ${
            isBold
              ? 'bg-[#ff4c60]/15 text-[#c91f26] font-bold border border-[#ff4c60]/40'
              : 'hover:bg-[#e9ecef] active:bg-[#dde2e6] text-[#222222]'
          } disabled:opacity-40`}
        >
          <i className="bi bi-type-bold font-bold text-sm"></i>
        </button>

        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); exec('italic'); }}
          disabled={isHtmlMode}
          title="Italic (Ctrl+I)"
          className={`w-8 h-8 flex items-center justify-center rounded transition-colors ${
            isItalic
              ? 'bg-[#ff4c60]/15 text-[#c91f26] font-bold border border-[#ff4c60]/40'
              : 'hover:bg-[#e9ecef] active:bg-[#dde2e6] text-[#222222]'
          } disabled:opacity-40`}
        >
          <i className="bi bi-type-italic text-sm"></i>
        </button>

        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); exec('underline'); }}
          disabled={isHtmlMode}
          title="Underline (Ctrl+U)"
          className={`w-8 h-8 flex items-center justify-center rounded transition-colors ${
            isUnderline
              ? 'bg-[#ff4c60]/15 text-[#c91f26] font-bold border border-[#ff4c60]/40'
              : 'hover:bg-[#e9ecef] active:bg-[#dde2e6] text-[#222222]'
          } disabled:opacity-40`}
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
          onMouseDown={saveSelection}
          onClick={handleInsertLink}
          disabled={isHtmlMode}
          title="Insert Link"
          className="w-8 h-8 flex items-center justify-center rounded hover:bg-[#e9ecef] active:bg-[#dde2e6] text-[#222222] disabled:opacity-40"
        >
          <i className="bi bi-link-45deg text-sm"></i>
        </button>

        <button
          type="button"
          onMouseDown={saveSelection}
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
            className={`px-2.5 py-1 text-xs font-semibold rounded flex items-center gap-1.5 transition-colors cursor-pointer ${
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
            onKeyUp={updateActiveFormat}
            onMouseUp={updateActiveFormat}
            onPaste={handlePaste}
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
