declare module '@radix-ui/react-icons' {
    import * as React from 'react';
    export const DragHandleDots2Icon: React.FC<React.SVGProps<SVGSVGElement>>;
    // Add other icons as needed or use a catch-all
    export const PlusIcon: React.FC<React.SVGProps<SVGSVGElement>>;
    export const TrashIcon: React.FC<React.SVGProps<SVGSVGElement>>;
    // ... generic fallback
    const content: { [key: string]: React.FC<React.SVGProps<SVGSVGElement>> };
    export default content;
}
