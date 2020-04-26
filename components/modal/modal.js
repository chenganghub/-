// components/modal/modal.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    visible: {
      type: Boolean,
      value: false
    }
  },
  options: {
    multipleSlots: true
  },
  externalClasses: ['modal_box_content', 'modal'],

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleClose() {
      this.triggerEvent("handleClose")
    }
  }
})