'use client';

import { useState } from 'react';
import { PlusIcon, TrashIcon, ArrowsUpDownIcon } from '@heroicons/react/24/outline';

interface Block {
  id: string;
  type: 'hero' | 'text' | 'image' | 'video' | 'form';
  content: Record<string, unknown>;
}

interface PageBuilderProps {
  blocks: Block[];
  onBlocksChange: (blocks: Block[]) => void;
}

const blockTypes = [
  { type: 'hero', label: 'Hero Section', icon: '🎯' },
  { type: 'text', label: 'Text Block', icon: '📝' },
  { type: 'image', label: 'Image Block', icon: '🖼️' },
  { type: 'video', label: 'Video Block', icon: '🎥' },
  { type: 'form', label: 'Form Block', icon: '📋' },
];

export default function PageBuilder({ blocks, onBlocksChange }: PageBuilderProps) {
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);

  const addBlock = (type: Block['type']) => {
    const newBlock: Block = {
      id: `block-${Date.now()}`,
      type,
      content: getDefaultContent(type),
    };
    
    onBlocksChange([...blocks, newBlock]);
  };

  const removeBlock = (blockId: string) => {
    onBlocksChange(blocks.filter(block => block.id !== blockId));
    if (selectedBlock === blockId) {
      setSelectedBlock(null);
    }
  };

  const updateBlock = (blockId: string, content: Record<string, unknown>) => {
    onBlocksChange(blocks.map(block => 
      block.id === blockId ? { ...block, content } : block
    ));
  };

  const moveBlock = (fromIndex: number, toIndex: number) => {
    const newBlocks = [...blocks];
    const [movedBlock] = newBlocks.splice(fromIndex, 1);
    newBlocks.splice(toIndex, 0, movedBlock);
    onBlocksChange(newBlocks);
  };

  const getDefaultContent = (type: Block['type']) => {
    switch (type) {
      case 'hero':
        return {
          title: 'Başlık',
          subtitle: 'Alt başlık',
          buttonText: 'Başla',
          buttonUrl: '#',
          backgroundImage: '',
        };
      case 'text':
        return {
          content: 'Metin içeriği buraya gelecek...',
          alignment: 'left',
          fontSize: 'medium',
        };
      case 'image':
        return {
          src: '',
          alt: 'Resim açıklaması',
          caption: '',
        };
      case 'video':
        return {
          src: '',
          title: 'Video başlığı',
          description: 'Video açıklaması',
        };
      case 'form':
        return {
          title: 'Form Başlığı',
          fields: [
            { type: 'text', label: 'Ad', required: true },
            { type: 'email', label: 'E-posta', required: true },
          ],
          submitText: 'Gönder',
        };
      default:
        return {};
    }
  };

  const renderBlockEditor = (block: Block) => {
    switch (block.type) {
      case 'hero':
        return (
          <div className="space-y-4">
            <input
              type="text"
              value={block.content.title as string || ''}
              onChange={(e) => updateBlock(block.id, { ...block.content, title: e.target.value })}
              className="w-full p-2 border rounded"
              placeholder="Başlık"
            />
            <input
              type="text"
              value={block.content.subtitle as string || ''}
              onChange={(e) => updateBlock(block.id, { ...block.content, subtitle: e.target.value })}
              className="w-full p-2 border rounded"
              placeholder="Alt başlık"
            />
            <input
              type="text"
              value={block.content.buttonText as string || ''}
              onChange={(e) => updateBlock(block.id, { ...block.content, buttonText: e.target.value })}
              className="w-full p-2 border rounded"
              placeholder="Buton metni"
            />
          </div>
        );
      case 'text':
        return (
          <textarea
            value={block.content.content as string || ''}
            onChange={(e) => updateBlock(block.id, { ...block.content, content: e.target.value })}
            className="w-full p-2 border rounded h-32"
            placeholder="Metin içeriği..."
          />
        );
      case 'image':
        return (
          <div className="space-y-4">
            <input
              type="text"
              value={block.content.src as string || ''}
              onChange={(e) => updateBlock(block.id, { ...block.content, src: e.target.value })}
              className="w-full p-2 border rounded"
              placeholder="Resim URL'i"
            />
            <input
              type="text"
              value={block.content.alt as string || ''}
              onChange={(e) => updateBlock(block.id, { ...block.content, alt: e.target.value })}
              className="w-full p-2 border rounded"
              placeholder="Alt text"
            />
          </div>
        );
      default:
        return <div className="text-gray-500">Bu blok türü için düzenleyici henüz mevcut değil</div>;
    }
  };

  const renderBlockPreview = (block: Block) => {
    switch (block.type) {
      case 'hero':
        return (
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-8 rounded-lg text-center">
            <h1 className="text-3xl font-bold mb-2">{block.content.title as string || 'Başlık'}</h1>
            <p className="text-xl mb-6">{block.content.subtitle as string || 'Alt başlık'}</p>
            <button className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100">
              {block.content.buttonText as string || 'Başla'}
            </button>
          </div>
        );
      case 'text':
        return (
          <div className="p-6 bg-white border rounded-lg">
            <p className="text-gray-800">{block.content.content as string || 'Metin içeriği...'}</p>
          </div>
        );
      case 'image':
        return (
          <div className="p-4 bg-white border rounded-lg">
            {block.content.src ? (
              <img src={block.content.src as string} alt={block.content.alt as string || ''} className="w-full h-48 object-cover rounded" />
            ) : (
              <div className="w-full h-48 bg-gray-200 rounded flex items-center justify-center text-gray-500">
                Resim yüklenmedi
              </div>
            )}
            {block.content.caption && typeof block.content.caption === 'string' && (
              <p className="text-sm text-gray-600 mt-2 text-center">{block.content.caption}</p>
            )}
          </div>
        );
      case 'video':
        return (
          <div className="p-4 bg-white border rounded-lg">
            <h3 className="font-semibold mb-2">{block.content.title as string || 'Video başlığı'}</h3>
            {block.content.src ? (
              <video controls className="w-full h-48 object-cover rounded">
                <source src={block.content.src as string} type="video/mp4" />
              </video>
            ) : (
              <div className="w-full h-48 bg-gray-200 rounded flex items-center justify-center text-gray-500">
                Video yüklenmedi
              </div>
            )}
          </div>
        );
      case 'form':
        return (
          <div className="p-6 bg-white border rounded-lg">
            <h3 className="font-semibold mb-4">{block.content.title}</h3>
            <div className="space-y-3">
              {block.content.fields.map((field: Record<string, unknown>, index: number) => (
                <div key={index}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field.label} {field.required && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type={field.type}
                    className="w-full p-2 border rounded"
                    placeholder={field.label}
                  />
                </div>
              ))}
              <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                {block.content.submitText}
              </button>
            </div>
          </div>
        );
      default:
        return <div className="p-4 bg-gray-100 rounded">Bilinmeyen blok türü</div>;
    }
  };

  return (
    <div className="flex gap-6">
      {/* Block Library */}
      <div className="w-64 bg-white p-4 rounded-lg shadow">
        <h3 className="font-semibold text-gray-900 mb-4">Blok Ekle</h3>
        <div className="space-y-2">
          {blockTypes.map((blockType) => (
            <button
              key={blockType.type}
              onClick={() => addBlock(blockType.type as Block['type'])}
              className="w-full p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
            >
              <span className="text-xl">{blockType.icon}</span>
              <span className="text-sm font-medium">{blockType.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Page Canvas */}
      <div className="flex-1">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-gray-900 mb-4">Sayfa Önizleme</h3>
          
          {blocks.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>Henüz blok eklenmedi</p>
              <p className="text-sm">Soldaki menüden blok ekleyerek başlayın</p>
            </div>
          ) : (
            <div className="space-y-4">
              {blocks.map((block, index) => (
                <div key={block.id} className="relative group">
                  {/* Block Controls */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex space-x-1">
                      <button
                        onClick={() => setSelectedBlock(selectedBlock === block.id ? null : block.id)}
                        className="p-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                      >
                        {selectedBlock === block.id ? 'Kapat' : 'Düzenle'}
                      </button>
                      <button
                        onClick={() => removeBlock(block.id)}
                        className="p-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
                      >
                        <TrashIcon className="h-3 w-3" />
                      </button>
                    </div>
                  </div>

                  {/* Block Preview */}
                  {renderBlockPreview(block)}

                  {/* Block Editor */}
                  {selectedBlock === block.id && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
                      <h4 className="font-medium text-gray-900 mb-3">Blok Düzenle</h4>
                      {renderBlockEditor(block)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
