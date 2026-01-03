"use client";
import MDEditor, { commands } from "@uiw/react-md-editor";
import { useTheme } from "next-themes";
import "../../styles/md-editor-custom.css";

const CustomMdEditor = ({ value, handleMdChange }) => {
  // Get the current theme
  const { resolvedTheme } = useTheme();

  // Custom md editor commands
  const customCommands = [
    commands.bold,
    commands.italic,
    commands.hr,
    commands.strikethrough,
    commands.divider,
    commands.unorderedListCommand,
    commands.orderedListCommand,
    commands.divider,
    commands.link,
    commands.quote,
    commands.group([commands.heading2, commands.heading3, commands.heading4], {
      name: "title",
      groupName: "title",
      buttonProps: { "aria-label": "Insert Title" },
    }),
    commands.codeBlock,
    commands.help,
  ];
  return (
    <div data-color-mode={resolvedTheme}>
      <MDEditor
        value={value}
        onChange={handleMdChange}
        height={400}
        preview="edit" // Options: "edit", "live", "preview"
        commands={customCommands}
        extraCommands={[
          commands.codeEdit,
          commands.codeLive,
          commands.codePreview,
        ]}
        textareaProps={{
          placeholder: "Write your blog content here... (Markdown supported)",
        }}
      />
    </div>
  );
};

export default CustomMdEditor;
