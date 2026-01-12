export interface MenuItem {
  showSubMenu?: boolean;
  icon?: string;
  icon_type?: 'svg' | 'mat';
  permissions?: string[];
  title: string;
  route: string;
  children?: MenuItem[];
  extended?: boolean;
  active?: boolean;
  badge?: number;
  disable_when?: any;
  hide_when?: any;
}
