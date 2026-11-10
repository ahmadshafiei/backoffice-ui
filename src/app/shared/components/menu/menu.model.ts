import { IconName } from '../icon/icons';

export interface MenuLeaf { label: string; path: string }

/** A top-level entry: either a collapsible group (`children`) or a direct link (`path`). */
export interface MenuGroup {
  id: string;
  label: string;
  icon: IconName;
  path?: string;
  children?: readonly MenuLeaf[];
}
