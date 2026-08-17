import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    // [{ list: "ordered" }, { list: "bullet" }],
    // [{ direction: "rtl" }],
    [{ align: [] }],
    ["link"],
    ["bold", "italic", "underline"],
  ],
};

const formats = [
  "bold",
  "italic",
  "underline",
  "header",
  "list",
  "direction",
  "align",
  "link",
];

export default function RichTextEditor({
  value,
  onChange,
  placeholder,
  className,
}: RichTextEditorProps) {
  return (
    <ReactQuill
      theme="snow"
      value={value}
      onChange={onChange}
      modules={modules}
      formats={formats}
      placeholder={placeholder}
      className={className}
      
    />
  );
}
