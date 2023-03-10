import { Component, OnInit } from '@angular/core';
//import { GeneralService } from "../../services/general.service";
//import { DatasetService } from "../../services/dataset.service";
import { SidebarService } from "../../services/sidebar-service.service";
import { MetadataItem } from "../../entities/dataset/metadata-entity";
import {AttachedFileItem} from "../../entities/general/attached-file-item";
//import { ChartOption, BarChartData, LineChartData} from "../../objects/charts-item";
import { DatasetsAPIs } from "../../server-communications/dataset-apis";
import { Router } from '@angular/router';
import { Chart, ChartData, ChartOptions } from 'chart.js/auto'
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-dataset-working-page',
  templateUrl: './dataset-working-page.component.html',
  styleUrls: ['./dataset-working-page.component.css']
})
export class DatasetWorkingPageComponent implements OnInit {
  PATH_ATTACHED = '/home/tosson/Desktop/Projects/datasets/attached_files/';
  metadata: MetadataItem[] = [];
  attachedFiles: AttachedFileItem[] =[]
  //activities: DatasetActivityItem[] = [];
  datasetName = "";
  inUseDatasetDoi = ""
  calaulationReq= "";
  visualizationReq= "";
  abstract = "";
  stopEditing = false
  public dataset: any;
  public chart : any;

  constructor(
    private sbService:SidebarService,
    //public flyingBtnService:GeneralService,
    //public datasetService:DatasetService,
    private router:Router,
    private http: HttpClient
    ) { }

  ngOnInit(): void {
    this.sbService.setVisibility(true)
    this.dataset = JSON.parse(sessionStorage.getItem('in_use_dataset')!)
    //this.flyingBtnService.setHeaderBarItems("back-to-dashboard");
    //this.inUseDatasetDoi = this.router.url.replace("/dataset/","")
    //this.datasetName =this.datasetService.GetDatasetInUse(this.inUseDatasetDoi)["dataset_name"];
    //this.UpdateActivitiesList();
    this.inUseDatasetDoi = this.dataset.dataset_doi;

    this.UpdateMetadatalist();
    this.UpdateAttachedFiles()

  }

  UpdateMetadatalist(){
    this.metadata = []
    DatasetsAPIs.GetMetadataByDoi(this.inUseDatasetDoi)
    .then(
     res=>{
         this.GetMetadata(res);
       }
     )
  }


  // UpdateActivitiesList(){
  //   this.activities = []
  //   DatasetsAPIs.GetDatasetActivities(this.inUseDatasetDoi)
  //   .then(
  //     res=>{
  //       const iterator = res.values();
  //       for (const value of iterator) 
  //       {   
  //         var act = new DatasetActivityItem()
  //         act = value;
  //         this.activities.push(act)
  //       }
  //     }
  //   )
  // }

  GetMetadata(dsDetails:any){
    for (const [key, value] of Object.entries(dsDetails)) {
      if (key=="_id"||key=="dataset_doi" || key=="dataset_name") {
        continue;
      }
      if (key=="abstract") {
        this.dataset.abstract = value as string;
        continue;
      }
      
      if (key=="publication_doi") {
        this.dataset.publication_doi = value as string;
        continue;
      }
      var mD = new MetadataItem;
      mD.key = key.replace("_", " ");
      mD.key = mD.key.charAt(0).toUpperCase() + mD.key.slice(1);
      mD.value = value as string;
      this.metadata.push(mD)
    }
  }

  AddNewMetadataItemOpenForm(){
    this.stopEditing = true
    var el = document.getElementById("add-new-item") as HTMLDivElement;
    el.style.display = "block";

  }


  EditMetadataItem(old_key:string, old_value:string){
    var DivEle = document.getElementById(old_key) as HTMLDivElement;
    var newKeVal = DivEle.getElementsByTagName("textarea") as HTMLCollectionOf <HTMLTextAreaElement>;

    console.log(old_key, " : ",old_value, " : ",newKeVal[0].value, "  : ", newKeVal[1].value )
    DatasetsAPIs.EditMetadataItem(this.inUseDatasetDoi, old_key, old_value, newKeVal[0].value, newKeVal[1].value)
    .then(
      ()=>{
        this.UpdateMetadatalist()
        this.CloseAddNewMetadataItemFrom(old_key)
      }
    )
  }

  AddNewMetadataItem(){
     var keyEle = document.getElementById("key") as HTMLInputElement;
     var valEle = document.getElementById("value") as HTMLInputElement;
     if(keyEle.value.length<1 || valEle.value.length<1)return;
     DatasetsAPIs.AddMetadataItem(this.inUseDatasetDoi, keyEle.value, valEle.value)
     .then(
       ()=>{
         this.UpdateMetadatalist()
         this.CloseAddNewMetadataItemFrom("add-new-item")
       }
     )
  //   .then(
  //     ()=>{
  //       var act = "added new metadata item; key: "+ keyEle.value+ " with value: "+valEle.value 
  //       DatasetsAPIs.InsertDatasetActivity(this.inUseDatasetDoi, sessionStorage.getItem('userID') , act)
  //       .then(
  //         ()=>{
  //           this.UpdateActivitiesList()
  //         }
  //       )
  //     }
  //   )
   }

  DeleteMetadataItem(key:string, value:string){
      if(confirm("Are you sure to delete this item")) {
        DatasetsAPIs.DeleteMetadataItem(this.inUseDatasetDoi, key, value)
        .then(
          res=>{
            this.UpdateMetadatalist()
          }
        )
      }
  }

  StartEditMetadataItem(key:string){
    this.stopEditing = true
    var el = document.getElementById(key) as HTMLDivElement;
    el.style.display = "block";
  }


  CloseAddNewMetadataItemFrom(id:string){
    var el = document.getElementById(id) as HTMLDivElement;
    el.style.display = "none";
    this.stopEditing = false

  }

  // StaticAnalysisClicked(event: { target: any; }){
  //   this.calaulationReq = event.target.id
  //   var el = document.getElementById("calculation-form") as HTMLDivElement;
  //   el.style.display = "block";
  //   el.getElementsByTagName('label')[1].innerHTML = "Result of the "+ this.calaulationReq + " =";

  // }

  // StartCalculation(){
  //   var colEle = document.getElementById("col") as HTMLInputElement;
  //   DatasetsAPIs.PerformACalculation(this.inUseDatasetDoi,this.calaulationReq , colEle.value)
  //   .then(
  //     res=>{
  //       var el = document.getElementById("results") as HTMLElement;
  //       el.innerHTML = res.res
  //       var act = "calculated the "+ this.calaulationReq+ " of col: "+colEle.value + " and the result was " + res.res;
  //       DatasetsAPIs.InsertDatasetActivity(this.inUseDatasetDoi, sessionStorage.getItem('userID') , act)
  //       .then(
  //         ()=>{
  //           this.UpdateActivitiesList()
  //         }
  //       )

  //     }
  //   ) 
  // }


  // VisualizeClicked(event: { target: any; }){
  //   this.visualizationReq = event.target.id
  //   var el = document.getElementById("visualisation-form") as HTMLDivElement;
  //   el.style.display = "block";
  // }

  // UpdateChartData(dataX:any, dataY:any){
  //   console.log(this.visualizationReq)
  //   if (this.visualizationReq == "bar") {
  //     var opt = new ChartOption();
  //     var d = new BarChartData()
  //     d.labels =  dataX;
  //     d.datasets.push({label:"",data: dataY})
  //     this.chart = new Chart(
  //     'acquisitions',
  //      {
  //        type: 'bar',
  //        options:  opt as ChartOptions,
  //         data: d as ChartData
  //       })
  //   } 
  //   else if(this.visualizationReq == "line") {
  //     var opt = new ChartOption();
  //     var dl = new LineChartData()
  //     dl.labels =  dataX;
  //     dl.datasets.push({label:"",data: dataY ,           
  //                       borderColor: 'rgba(148,159,177,1)',
  //                       pointHoverBackgroundColor: 'rgba(148,159,177,1)',
  //                       pointHoverBorderColor: 'rgba(148,159,177,0.8)',
  //                       backgroundColor:'rgba(148,159,177,1)'})
  //     this.chart = new Chart(
  //     'acquisitions',
  //      {
  //        type: 'line',
  //        options:  opt as ChartOptions,
  //         data: dl as ChartData
  //       })
  //   }
  //   else{
  //     return
  //   }
  //   this.chart.update()

  // }

  // StartVisualisation(){
  //   var xColEle = document.getElementById("x-col") as HTMLInputElement;
  //   var yColEle = document.getElementById("y-col") as HTMLInputElement;
  //   var el = document.getElementById("chart-div") as HTMLDivElement;
  //   el.style.display = "block";
  //   DatasetsAPIs.GetDatasetCols(this.inUseDatasetDoi, xColEle.value, yColEle.value)
  //   .then(
  //     res=>{
  //       if(this.chart !== undefined)this.chart.destroy()
  //       this.UpdateChartData(res.col1, res.col2)
  //     }
  //   )
    
  //   .then(
  //     ()=>{
  //       var act = "plotted a "+ this.visualizationReq + " graph"+ " with col: "+ xColEle.value + " on x-axis and col:" 
  //       +  yColEle.value+ " on y-axis"
  //       DatasetsAPIs.InsertDatasetActivity(this.inUseDatasetDoi, sessionStorage.getItem('userID') , act)
  //       .then(
  //         ()=>{
  //           this.UpdateActivitiesList()
  //         }
  //       )
  //     }
  //   )
  // }  

  // onLogScaleCheckboxChange(event: { target: any; }){
  //   var cBX = document.getElementById("xlog") as HTMLInputElement;
  //   var cBY = document.getElementById("ylog") as HTMLInputElement;
  //   var opt = new ChartOption();
  //   opt.scales.x.type = cBX.checked ? 'logarithmic':'linear'
  //   opt.scales.y.type = cBY.checked ? 'logarithmic':'linear'
  //   this.chart.options = opt as ChartOptions;
  //      this.chart.update()
  // }

  SaveChartToAttacherFiles(){
    var el = document.getElementById("chart-name-form") as HTMLDivElement;
    el.style.display = "block";
  }

  UpdateAttachedFiles(){
    this.attachedFiles = []
    var f = new AttachedFileItem();
    f.added_on = "01.01.2001"
    f.login_name = "admin"
    f.attached_file_name = "test"
    this.attachedFiles.push(f)
    var f = new AttachedFileItem();
    f.added_on = "01.01.2021"
    f.login_name = "admin"
    f.attached_file_name = "test2"
    this.attachedFiles.push(f)
  //   DatasetsAPIs.GetAttachedFilesByDatasetDoi(this.inUseDatasetDoi)
  //   .then(
  //     res=>{
  //       //console.log(res.files)
  //       const iterator = res.files.values();
  //       for (const value of iterator) 
  //       { 
  //         var file = new AttachedFileItem();
  //         file = value
  //         this.attachedFiles.push(file)
  //       }
  //     }
  //   )

  }

  CloseChartNameForm(){
    var el = document.getElementById("chart-name-form") as HTMLDivElement;
    el.style.display = "none"; 
  }

  // StartSavingChart(){
  //   var chartName = document.getElementById("chart-name") as HTMLInputElement;
  //   var el = document.getElementById('acquisitions') as HTMLCanvasElement;
    
  //   var image = el.toDataURL("image/png");
  //   const imgFile = new File([image], this.inUseDatasetDoi + "_atta_" +chartName.value);
  //   const formData = new FormData();
  //   formData.append('file', imgFile, this.inUseDatasetDoi + "_atta_"+sessionStorage.getItem('userID')+"_1_" + chartName.value);
  //   this.http.post<any>('http://141.99.126.53:3050/saveattach',formData, {reportProgress: true})
  //   .subscribe(res => {
  //     if (res.affectedRows ==1) 
  //     {
  //       this.UpdateAttachedFiles()
  //       var el = document.getElementById("chart-name-form") as HTMLDivElement;
  //       el.style.display = "none";
  //     }
  //     else{
  //       return 
  //     }

  //   })

  //   var act = "saved an attachment with file name: "+chartName.value;
  //       DatasetsAPIs.InsertDatasetActivity(this.inUseDatasetDoi, sessionStorage.getItem('userID') , act)
  //       .then(
  //         ()=>{
  //           this.UpdateActivitiesList()
  //         }
  //       )
    

  // }
}
