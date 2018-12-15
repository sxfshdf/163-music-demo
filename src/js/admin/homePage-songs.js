{
  let view = {
    el: '.songs',
    init() {
      this.$el = $(this.el)
    },
    template: `
      <h4 class="songsTitle">最新歌曲</h4>
      <div class="tableContainer">
        <table>
          <thead>
            <tr>
              <th class="name">歌名</th>
              <th class="singer">歌手</th>
              <th class="createTime">创建时间</th>
              <th class="updateTime">更新时间</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="name">天后天后天后天</td>
              <td class="singer">陈势安陈</td>
              <td class="createTime">2018/12/5 下午10:57:23</td>
              <td class="updateTime">2018/12/5 下午10:57:23</td>
            </tr>
          </tbody>
        </table>
    `,
    render(data) {
      this.$el.html(this.template)
      let { songs } = data
      let tdDoms = songs.map((song)=>{
        return `<tr>
        <td class="name">${song.name}</td>
        <td class="singer">${song.singer}</td>
        <td class="createTime">${song.createTime}</td>
        <td class="updateTime">${song.updateTime}</td>
      </tr>`
      })
      this.$el.find('tbody').empty()
      tdDoms.map((tdDom)=>{
        this.$el.find('tbody').append(tdDom)
      })
    }
  }

  let model = {
    data:{
      songs: []
    },
    find(){
      let query = new AV.Query('Song')
      query.descending('updatedAt')
      // query.ascending('createdAt')
      return query.find().then((songs) => {
        this.data.songs = songs.map((song) => {
          let songs = { id: song.id, ...song.attributes }
          let createDate = song.createdAt.toLocaleDateString()
          let createHours = time(song.createdAt.getHours())
          let createMinutes = time(song.createdAt.getMinutes())
          let createSeconds = time(song.createdAt.getSeconds())

          let updateDate = song.updatedAt.toLocaleDateString()
          let updateHours = time(song.updatedAt.getHours())
          let updateMinutes = time(song.updatedAt.getMinutes())
          let updateSeconds = time(song.updatedAt.getSeconds())
          function time(time) {
            if (time < 10) {
              time = '0' + time
            }
            return time
          }
          let createTime = createDate + ' ' + createHours + ':' + createMinutes + ':' + createSeconds
          let updateTime = updateDate + ' ' + updateHours + ':' + updateMinutes + ':' + updateSeconds
          songs.createTime = createTime
          songs.updateTime = updateTime
          return songs
        })
        return songs
      })
    },
  }

  let controller = {
    init(view, model) {
      this.view = view
      this.view.init()
      this.model = model
      // this.view.render(this.model.data)
      this.bindEvents()
      this.model.find().then(()=>{
        this.view.render(this.model.data)
      })
      this.bindEventHub()
    },
    bindEvents() {},
    bindEventHub(){
      window.eventHub.on('create',()=>{
        this.model.find().then(()=>{
          this.view.render(this.model.data)
        })
      })
      window.eventHub.on('update',()=>{
        this.model.find().then(()=>{
          this.view.render(this.model.data)
        })
      })
      window.eventHub.on('deleteSongDone',(data)=>{
        this.view.render(data)
      })
      
    }
  }

  controller.init(view, model)
}