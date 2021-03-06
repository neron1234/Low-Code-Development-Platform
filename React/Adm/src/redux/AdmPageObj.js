
import { getAsyncTypes } from '../helpers/actionType'
import * as AdmPageObjService from '../services/AdmPageObjService'
import {RintagiScreenRedux,initialRintagiScreenReduxState} from './_ScreenReducer'
const Label = {
  PostToAp: 'Post to AP',
}
class AdmPageObjRedux extends RintagiScreenRedux {
    allowTmpDtl = false;
    constructor() {
      super();
      this.ActionApiNameMapper = {
        'GET_SEARCH_LIST' : 'GetAdmPageObj1001List',
        'GET_MST' : 'GetAdmPageObj1001ById',
        'GET_DTL_LIST' : 'GetAdmPageObj1001DtlById',
      }
      this.ScreenDdlDef = [
{ columnName: 'SectionCd1277', payloadDdlName:'SectionCd1277List', keyName:'SectionCd1277',labelName:'SectionCd1277Text', forMst: true, isAutoComplete:false, apiServiceName: 'GetSectionCd1277List', actionTypeName: 'GET_DDL_SectionCd1277' },
{ columnName: 'GroupRowId1277', payloadDdlName:'GroupRowId1277List', keyName:'GroupRowId1277',labelName:'GroupRowId1277Text', forMst: true, isAutoComplete:true, apiServiceName: 'GetGroupRowId1277List', actionTypeName: 'GET_DDL_GroupRowId1277' },
{ columnName: 'GroupColId1277', payloadDdlName:'GroupColId1277List', keyName:'GroupColId1277',labelName:'GroupColId1277Text', forMst: true, isAutoComplete:true, apiServiceName: 'GetGroupColId1277List', actionTypeName: 'GET_DDL_GroupColId1277' },
{ columnName: 'LinkTypeCd1277', payloadDdlName:'LinkTypeCd1277List', keyName:'LinkTypeCd1277',labelName:'LinkTypeCd1277Text', forMst: true, isAutoComplete:true, apiServiceName: 'GetLinkTypeCd1277List', actionTypeName: 'GET_DDL_LinkTypeCd1277' },
      ]
      this.ScreenOnDemandDef = [

//        { columnName: 'TrxDetImg65', tableColumnName: 'TrxDetImg', forMst: false, apiServiceName: 'GetColumnContent', actionTypeName: 'GET_COLUMN_TRXDETIMG65' },
      ]

      this.ScreenCriDdlDef = [
{ columnName: 'SectionCd10', payloadDdlName: 'SectionCd10List', keyName:'SectionCd', labelName:'SectionName', isCheckBox:false, isAutoComplete: false, apiServiceName: 'GetScreenCriSectionCd10List', actionTypeName: 'GET_DDL_CRISectionCd10' },
      ]
      this.SearchActions = {
        ...[...this.ScreenDdlDef].reduce((a,v)=>{a['Search' + v.columnName] = this.MakeSearchAction(v); return a;},{}),
        ...[...this.ScreenCriDdlDef].reduce((a,v)=>{a['SearchCri' + v.columnName] = this.MakeSearchAction(v); return a;},{}),
        ...[...this.ScreenOnDemandDef].reduce((a,v)=>{a['Get' + v.columnName] = this.MakeGetColumnOnDemandAction(v); return a;},{}),
      } 
      this.ScreenDdlSelectors = this.ScreenDdlDef.reduce((a,v)=>{a[v.columnName] = this.MakeDdlSelectors(v); return a;},{})
      this.ScreenCriDdlSelectors = this.ScreenCriDdlDef.reduce((a,v)=>{a[v.columnName] = this.MakeCriDdlSelectors(v); return a;},{})
      this.actionReducers = this.MakeActionReducers();
    }
    GetScreenName(){return 'AdmPageObj'}
    GetMstKeyColumnName(isUnderlining = false) {return isUnderlining ? 'PageObjId' :  'PageObjId1277'}
    GetDtlKeyColumnName(isUnderlining = false) {return isUnderlining ? 'PageLnkId'  :'PageLnkId1278'}
    GetPersistDtlName() {return this.GetScreenName() + '_Dtl'}
    GetPersistMstName() {return this.GetScreenName() + '_Mst'}
    GetWebService() {return AdmPageObjService}
    GetReducerActionTypePrefix(){return this.GetScreenName()};
    GetActionType(actionTypeName){return getAsyncTypes(this.GetReducerActionTypePrefix(),actionTypeName)}
    GetInitState(){
      return {
        ...initialRintagiScreenReduxState,
        Label: {
          ...initialRintagiScreenReduxState.Label,
          ...Label, 
        }
      }
      };
    
    GetDefaultDtl(state) { 
      return (state || {}).NewDtl || 
      {
       PageLnkId1278: null,
PageLnkTxt1278: null,
PageLnkRef1278: null,
PageLnkImg1278: null,
PageLnkAlt1278: null,
PageLnkOrd1278: null,
Popup1278: null,
PageLnkCss1278: null,
      }
    }
    ExpandMst(mst, state, copy) {
      return {
        ...mst,
		 key: Date.now(),
        PageObjId1277: copy ? null : mst.PageObjId1277,
		
        // CurrencyId64Text: GetCurrencyId64Cd(mst.CurrencyId64, state),
        // MemberId64Text: GetMemberId64Text(mst.MemberId64, state),
        // /* specific app rule */
        // Posted64: copy ? 'N' : mst.Posted64,
        // TrxTotal64: copy ? '0' : mst.TrxTotal64,
      }
    }

ExpandDtl(dtlList, copy) {
                                if (!copy) return dtlList;
                                else if (!this.allowTmpDtl) return []; 
                                else { const now = Date.now();
                                  return dtlList.map((v,i) => {
                                  return {
                                    ...v,
                                    PageObjId1277: null,
                                    PageLnkId1278: null,
                                    TmpKeyId: now + i,
                                  }
                                })
                              };
                            }    
    
    SearchListToSelectList(state) {
        const searchList = ((state || {}).SearchList || {}).data || [];
        return searchList
          .map((v, i) => {
            return {
              key: v.key || null,
              value: v.labelL || v.label || ' ', 
              label: v.labelL || v.label || ' ',
              labelR: v.labelR || ' ',
              // detailR: v.detailR ? GetCurrencyId64Cd(v.detailR, state) : '',
			  detailR: v.detailR,
              detail: v.detail || '',
              idx: i,
              // CurrencyId64: v.detailR,
              isSelected: v.isSelected,
            }
          })
    }
  }

/* ReactRule: Redux Custom Function */

/* ReactRule End: Redux Custom Function */

  /* helper functions */
  // export function GetCurrencyId64Cd(CurrencyId64, state) {
    // try {
      // const d = ((state.ddl.CurrencyId64 || {}) || []).reduce((r, v, i, a) => { r[v.CurrencyId64] = v.CurrencyName; return r; }, {});
      // return (d || {})[CurrencyId64];
    // } catch (e) {
      // return '';
    // }
  // }

  // export function GetMemberId64Text(MemberId64, state) {
    // try {
      // const d = (state.ddl.MemberId64).reduce((r, v, i, a) => { r[v.key] = v.label; return r; }, {});
      // return (d || {})[MemberId64];
    // } catch (e) {
      // return '';
    // }
  // }

  export function ShowMstFilterApplied(state) {
    return !state 
      || !state.ScreenCriteria
//      || (state.ScreenCriteria.MemberId10 || {}).LastCriteria
//      || (state.ScreenCriteria.CustomerJobId20 || {}).LastCriteria
//      || (state.ScreenCriteria.Posted30 ||{}).LastCriteria
|| (state.ScreenCriteria.SectionCd10 || {}).LastCriteria
      || state.ScreenCriteria.SearchStr;
  }

  export default new AdmPageObjRedux()
            