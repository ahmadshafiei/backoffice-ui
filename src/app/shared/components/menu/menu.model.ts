import { IconName } from '../icon/icons';

/** A menu entry: a link (`path`), a nested group (`children`), or both. */
export interface MenuLeaf {
  label?: string;
  path?: string;
  children?: readonly MenuLeaf[];
  separator?: boolean;
}

/** A top-level entry: either a collapsible group (`children`) or a direct link (`path`). */
export interface MenuGroup {
  id: string;
  label: string;
  icon: IconName;
  path?: string;
  children?: readonly MenuLeaf[];
}
