import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { INSERT_HORIZONTAL_RULE_COMMAND } from "@lexical/react/LexicalHorizontalRuleNode";
import { ImageIcon, LayoutDashboard, Minus, Pencil, Plus, Sigma, Table } from "lucide-react";
import { DropdownMenu, DropdownMenuItem, DropdownMenuContent, DropdownMenuTrigger } from "@lana/ui";
import { ToolbarButton } from "./toolbar-button";

export function InsertDropDown({
  setShowTableDialog,
  setShowImageDialog,
  setShowEquationDialog,
  setShowExcalidrawModal,
  setShowLayoutDialog,
}: {
  setShowTableDialog: (show: boolean) => void;
  setShowImageDialog: (show: boolean) => void;
  setShowEquationDialog: (show: boolean) => void;
  setShowExcalidrawModal: (show: boolean) => void;
  setShowLayoutDialog: (show: boolean) => void;
}) {
  const [editor] = useLexicalComposerContext();

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger render={<ToolbarButton icon={Plus} title="Insert" />} />
      <DropdownMenuContent
        align="start"
        side="top"
        sideOffset={10}
        className="animate-in slide-in-from-top-2 duration-200"
      >
        <DropdownMenuItem
          className="hover:bg-accent/80 transition-colors"
          onClick={() => editor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined)}
        >
          <Minus data-icon="inline-start" />
          Divider
        </DropdownMenuItem>
        <DropdownMenuItem
          className="hover:bg-accent/80 transition-colors"
          onClick={() => setShowTableDialog(true)}
        >
          <Table data-icon="inline-start" />
          Table
        </DropdownMenuItem>
        <DropdownMenuItem
          className="hover:bg-accent/80 transition-colors"
          onClick={() => setShowImageDialog(true)}
        >
          <ImageIcon data-icon="inline-start" />
          Image
        </DropdownMenuItem>
        <DropdownMenuItem
          className="hover:bg-accent/80 transition-colors"
          onClick={() => setShowLayoutDialog(true)}
        >
          <LayoutDashboard data-icon="inline-start" />
          Columns
        </DropdownMenuItem>
        <DropdownMenuItem
          className="hover:bg-accent/80 transition-colors"
          onClick={() => setShowExcalidrawModal(true)}
        >
          <Pencil data-icon="inline-start" />
          Drawing
        </DropdownMenuItem>
        <DropdownMenuItem
          className="hover:bg-accent/80 transition-colors"
          onClick={() => setShowEquationDialog(true)}
        >
          <Sigma data-icon="inline-start" />
          Equation
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
