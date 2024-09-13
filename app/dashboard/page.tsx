import {Menu, MenuItem, Sidebar, SubMenu} from "react-pro-sidebar";

export default function Dashboard (){
  return <div>
    <Sidebar>
      <Menu>
        <MenuItem>Dashboard</MenuItem>
        <SubMenu title="Components">
          <MenuItem>Component 1</MenuItem>
          <MenuItem>Component 2</MenuItem>
        </SubMenu>
      </Menu>
    </Sidebar>
  </div>
}