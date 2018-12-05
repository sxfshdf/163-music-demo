{
  let view = {
    el: '.songList',
    template: `
      <table>
        <thead>
          <tr>
            <th class="name">歌名</th>
            <th class="singer">歌手</th>
            <th class="createTime">创建时间</th>
            <th class="updateTime">更新时间</th>
            <th class="actions">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="name">天后天后天后天后天后</td>
            <td class="singer">陈势安陈</td>
            <td class="createTime">2018.02.02.02.03.03</td>
            <td class="updateTime">2018.02.02.02.03.03</td>
            <td>
              <span class="far fa-edit edit"></span>
              <span class="far fa-trash-alt delete"></span>
            </td>
          </tr>
        </tbody>
      </table>
    `,
    render(data){
      $(this.el).html(this.template)
    },
    hideSongList(){
      $(this.el).css('display','none')
    },
    showSongList(){
      $(this.el).css('display','block')
    }
  }

  let model = {}

  let controller = {
    init(view,model){
      this.model = model
      this.view = view
      this.view.render(this.model.data)

      window.eventHub.on('upload',(data)=>{
        this.view.hideSongList()
      })

      window.eventHub.on('cancel',(data)=>{
        this.view.showSongList()
      })
    }
  }

  controller.init(view,model)
}