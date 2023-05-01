import { Injectable, ComponentRef, SimpleChange } from '@angular/core';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root'
})
export class CustomService {

  constructor(private utilsService: UtilsService) { }
  wrapperRefs = Array<ComponentRef<any>>();
  chartRefList = Array<ComponentRef<any>>();
  // 記錄頁面元件數量狀態
  componentsArray = [];
  inputData;


  pushChartRefs(componentRef: ComponentRef<any>) {
    console.log(componentRef)
    this.chartRefList.push(componentRef);
    console.log(this.chartRefList)
  }

  pushComponent(component) {
    this.componentsArray.push(component);
  }

  getWrapperRefs() {
    return this.wrapperRefs;
  }

  //開啟每個widget的刪除按鈕
  refreshRemoveMode(removeable) {
    console.log(this.chartRefList)
    this.chartRefList.forEach(ref => {
      ref.instance['data'] = ref.instance['data'];
      ref.instance['updateStatus'] = false;
      // 讓編輯與刪除按鈕都顯示
      ref.instance['removable'] = removeable;
      // 產生 change
      const changes = {
        data: new SimpleChange(undefined, "", false)
      };
      // 傳入到 Onchange
      if (typeof ref.instance.ngOnChanges !== 'undefined') {
        ref.instance.ngOnChanges(changes);
      }
    });
  }

  removeComponent(uniqueKey) {
    console.log(uniqueKey)
    // 移除外層容器
    const idx = this.chartRefList.findIndex(e => e.instance.uniqueKey === uniqueKey)
    this.chartRefList[idx].destroy();
    this.chartRefList = this.chartRefList.filter(e => e.instance.uniqueKey !== uniqueKey);
    // 移除內部元件
    this.componentsArray.splice(idx, 1);
  }

  async getComponentsArray() {
    if (this.componentsArray.length === 0) {
      // 可以設定成從後端撈取設定值
      const arr = []
      return arr;
    } else {
      return this.componentsArray;
    }
  }

  updateInputData(component, targetRef, status, year) {
    this.inputData = {};
    // console.log(component);
    // console.log(targetRef);
    // console.log(status);
    // console.log(year);
    // 產生 InputData
    this.inputData = this.utilsService.getData(component.name, year);
    // 傳入到 Input 中，會觸發在 ngOnInit
    targetRef.instance['data'] = this.inputData;
    targetRef.instance['updateStatus'] = status;
    // 產生 change
    const changes = {
      data: new SimpleChange(undefined, this.inputData, false)
    };
    // 傳入到 Onchange
    if (typeof targetRef.instance.ngOnChanges !== 'undefined') {
      targetRef.instance.ngOnChanges(changes);
    }
  }


}
