import { element } from 'protractor';
import { UtilsService } from './../../services/utils.service';
import { AfterViewInit, Component, ComponentFactoryResolver, ComponentRef, ElementRef, OnInit, QueryList, Renderer2, SimpleChange, ViewChild, ViewChildren } from '@angular/core';
import { NbSidebarService } from '@nebular/theme';
import { CustomService } from 'src/app/services/custom.service';
import { DynamicComponentHostDirective } from './dynamic-component-host.directive';
import { SmallComponent } from 'src/app/shared-components/custom/small/small.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

import { LineChartComponent } from "src/app/shared-components/line-chart/line-chart.component";
import { BarChartComponent } from "src/app/shared-components/bar-chart/bar-chart.component";

import { GridStack, GridStackWidget } from 'gridstack';
import 'gridstack/dist/gridstack.min.css';
import 'gridstack/dist/h5/gridstack-dd-native';


@Component({
  selector: 'app-custom',
  templateUrl: './custom.component.html',
  styleUrls: ['./custom.component.scss']
})
export class CustomComponent implements OnInit, AfterViewInit {
  // @ViewChild(DynamicComponentHostDirective, { static: true }) dynamicComponentLoader: DynamicComponentHostDirective;

  disabled: boolean
  @ViewChildren(DynamicComponentHostDirective) adHosts: QueryList<DynamicComponentHostDirective>;

  constructor(
    public componenFactoryResolver: ComponentFactoryResolver,
    private sidebarService: NbSidebarService,
    private renderer2: Renderer2,
    private customService: CustomService,
    private utilsService: UtilsService,
  ) { }
  sideState = false;
  editable = true;
  removeable = false;
  childUniqueKey: number = 0;
  componentsIndex: Array<number> = [];
  componentsReferences = Array<ComponentRef<any>>();
  selectedYear = 2023;
  wrappers = {
    small: SmallComponent,
  };
  shakeIdx = ['1', '2', '3'];
  // 紀錄當前的 Dynamic Component
  public targetRefs = []

  movies: any[] = [
    {
      name: '折線圖',
      img: './assets/line.jpg',
      size: 'col-xl-6 col-12',
      val: LineChartComponent,
      disabled: true,
      id: 1,
    },
    {
      name: '長條圖',
      img: './assets/bar.jpg',
      size: 'col-xl-3 col-lg-6 col-12',
      val: BarChartComponent,
      disabled: true,
      id: 2,
    },
    {
      name: '長條圖',
      img: './assets/bar.jpg',
      size: 'col-xl-3 col-lg-6 col-12',
      val: BarChartComponent,
      disabled: true,
      id: 3,
    },
    // {
    //   component: 'job',
    //   data: { headline: 'head1', body: 'body1' },
    //   labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    //   series: [[820, 932, 901, 0, 1290, 1330, 1320]],
    //   val: HeroJobAdComponent,
    //   size: 'col-xl-6 col-12',
    //   disabled: false,
    //   id: 1,
    // },
    // {
    //   component: 'profile',
    //   data: { name: 'jason', bio: 'male' },
    //   labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    //   series: [[820, 932, 901, 200, 1290, 1330, 1320]],
    //   val: HeroProfileComponent,
    //   size: 'col-xl-3 col-lg-6 col-12',
    //   disabled: false,
    //   id: 2,
    // },
    // {
    //   component: 'job',
    //   data: { headline: 'head2', body: 'body2' },
    //   labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    //   series: [[820, 932, 500, 934, 1290, 1330, 1320]],
    //   val: HeroJobAdComponent,
    //   size: 'col-xl-6 col-12',
    //   disabled: false,
    //   id: 3,
    // },
    // {
    //   component: 'profile',
    //   data: { name: 'mary', bio: 'female' },
    //   labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    //   series: [[820, 932, 400, 934, 1290, 1330, 1320]],
    //   val: HeroProfileComponent,
    //   size: 'col-xl-3 col-lg-6 col-12',
    //   disabled: false,
    //   id: 4,
    // },
  ];

  public serializedData:GridStackWidget[];
  
  options = { // put in gridstack options here
    disableOneColumnMode: false,
    float: true,
    removable: false,
    disableDrag: false,
    disableResize: false,
    resizable: { autoHide: true, handles: 'all' },
  };

  ngOnInit() {

  }

  ngAfterViewInit(): void {
    this.initComponent();



  }

  //渲染畫面
  initComponent() {
    var grid = GridStack.init();
    // grid.addWidget();

    this.adHosts.forEach((host, index) => {
      // console.log(host)
      // console.log(index)
      const adItem = this.movies.find((x) => x.id == index + 1);

      if (host.viewContainerRef) host.viewContainerRef.clear()
      const vcRef = host.viewContainerRef;
      const componentFactory = this.componenFactoryResolver.resolveComponentFactory(adItem.val);
      const targetRef = vcRef.createComponent(componentFactory);

      // 暫存,添加刪除id
      this.customService.pushChartRefs(targetRef);
      targetRef.instance['uniqueKey'] = ++this.childUniqueKey;

      // 更新資料
      this.customService.updateInputData(adItem, targetRef, false, 2023);
      targetRef.changeDetectorRef.detectChanges();

      // 訂閱刪除事件
      targetRef.instance['remove'].subscribe(componentIdx => {
        this.customService.removeComponent(componentIdx);
      });
      // 編輯事件
      targetRef.instance['changeUpdateStatus'].subscribe(status => {
        // console.log(status)
        this.customService.updateInputData(adItem, targetRef, status, 2023)
      })

      let html = "item" + index + " ng-star-inserted grid-stack-item";

      document.getElementsByClassName("item" + index)[0].setAttribute("class", html);
      const item = document.querySelector('.item' + index);
      grid.addWidget(item, { w:6, h: 2 });
      
    })

  }

  createComponent(component, isNew) {
    console.log(component); // {}物件
    this.sideBarCollapse(); //收起右側邊欄位元件
    let maxId = Math.max(...this.movies.map((x) => x.id));
    component['id'] = maxId + 1;
    this.movies.push(component)

    setTimeout(() => {
      this.initComponent();
    }, 300);
  }

  drop(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.movies, event.previousIndex, event.currentIndex);
  }
  // 開啟 移除元件模式
  toggleRemoveMode(event) {
    console.log(event)
    // 把每一個元件加上 remove 的按鈕
    this.customService.refreshRemoveMode(event);
  }
  //開啟關閉拖曳
  toggleDrag(event) {
    if (event) {
      this.movies.forEach(item => {
        item['disabled'] = false;
      })
    } else {
      this.movies.forEach(item => {
        item['disabled'] = true;
      })
    }
  }
  // 側選單相關
  sideBarExpand() {
    // 收合側元件選單
    this.sideState = true;
    this.sidebarService.expand('selector');
  }
  sideBarCollapse() {
    // 收合側元件選單
    this.sideState = false;
    this.sidebarService.collapse('selector');
  }
  sidebarToggle() {
    this.sideState = !this.sideState
    this.sidebarService.toggle(true, 'selector');
  }
  addComponent() {
    //+號
    this.sideBarExpand();
  }
}
