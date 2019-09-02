
//重构数据====树结构
function designData_tree(menuList) {
  
  //深克隆
  let cloneData = JSON.parse(JSON.stringify(menuList))
  for(let i = 0; i< cloneData.length; i++){
    cloneData[i]['label'] = cloneData[i].menu_name ; // + cloneData[i].id
  }
  // 父级id ===  子级 pid
  return cloneData.filter(father => {

    let branchArr = cloneData.filter(child => father['id'] == child['pid']);
    branchArr.length > 0 ? father['children'] = branchArr : ''

    return father['pid'] == 0 // 目前一级 pid：0
  })

}
// 修正数据
function modifyData(data) {  
  
  for (let i = 0; i < data.length; i++) {
    //父级
    let item = data[i];
    if (item.children) {
      // 父级 path
      
      // alwaysShow: true
      let _index = item.path.indexOf('/');
      if( _index > -1){
        var _icon_name = item.path.slice(_index+1);
      }
      item['component']  = 'Layout';  // 一级菜单强行加 Layout
      item['alwaysShow'] = true;
      // meta
      item['meta'] = {
        title: item.menu_name,
        icon: _icon_name
      }
      if (item.hasOwnProperty('children')) {
        //注意 children是数组
        for (let i = 0; i < item.children.length; i++) {
          
          // meta
          item['children'][i]['meta'] = {
            title: item.children[i].menu_name
          }
          // component  name
          item.children[i]['name']  = item.children[i].path;
          item.children[i]['component'] = item.children[i].path;
        }
      }
    }
  }

  return data;
}
export default {
  designData_tree
}


