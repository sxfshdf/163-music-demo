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
            <td class="name">天后天后天后天</td>
            <td class="singer">陈势安陈</td>
            <td class="createTime">2018/12/5 下午10:57:23</td>
            <td class="updateTime">2018/12/5 下午10:57:23</td>
            <td>
              <span class="far fa-edit edit"></span>
              <span class="far fa-trash-alt delete"></span>
            </td>
          </tr>
        </tbody>
      </table>
    
    `,
    render(data) {
      $(this.el).html(this.template)
      let { songs } = data
      let songs1 = songs.reverse()
      let trList = songs1.map((song) => {
        return ` <tr><td class="name">${song.name}</td><td class="singer">${song.singer}</td>
        <td class="createTime">${song.createTime}</td><td class="updateTime">${song.updateTime}</td><td>
        <span class="far fa-edit edit"></span>
        <span class="far fa-trash-alt delete"></span>
        </td></tr>`
      })
      $(this.el).find('tbody').empty()
      trList.map((trDom) => {
        $(this.el).find('tbody').append(trDom)
      })
    },
    hideSongList() {
      $(this.el).css('display', 'none')
    },
    showSongList() {
      $(this.el).css('display', 'block')
    }
  }

  let model = {
    data: {
      songs: []
    },
    find() {
      let query = new AV.Query('Song')
      query.ascending('createdAt')
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
        console.log(songs.length)
        return songs
      })
    }
  }

  let controller = {
    init(view, model) {
      this.model = model
      this.view = view
      this.view.render(this.model.data)

      window.eventHub.on('upload', (data) => {
        this.view.hideSongList()
      })

      window.eventHub.on('cancel', (data) => {
        this.view.showSongList()
      })

      window.eventHub.on('create', (data) => {
        this.view.showSongList()
        this.model.data.songs.push(data)
        this.view.render(this.model.data)
      })
      this.model.find().then((data)=>{
        this.view.render(this.model.data)
      })
    }
  }

  controller.init(view, model)
}