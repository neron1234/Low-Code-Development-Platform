
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Prompt, Redirect } from 'react-router';
import { Button, Row, Col, ButtonToolbar, ButtonGroup, DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown, Nav, NavItem, NavLink } from 'reactstrap';
import { Formik, Field, Form } from 'formik';
import DocumentTitle from 'react-document-title';
import classNames from 'classnames';
import LoadingIcon from 'mdi-react/LoadingIcon';
import CheckIcon from 'mdi-react/CheckIcon';
import DatePicker from '../../components/custom/DatePicker';
import NaviBar from '../../components/custom/NaviBar';
import DropdownField from '../../components/custom/DropdownField';
import AutoCompleteField from '../../components/custom/AutoCompleteField';
import RintagiScreen from '../../components/custom/Screen';
import ModalDialog from '../../components/custom/ModalDialog';
import { showNotification } from '../../redux/Notification';
import { registerBlocker, unregisterBlocker } from '../../helpers/navigation'
import { isEmptyId, getAddDtlPath, getAddMstPath, getEditDtlPath, getEditMstPath, getNaviPath, getDefaultPath } from '../../helpers/utils'
import { toMoney, toLocalAmountFormat, toLocalDateFormat, toDate, strFormat } from '../../helpers/formatter';
import { setTitle, setSpinner } from '../../redux/Global';
import { RememberCurrent, GetCurrent } from '../../redux/Persist'
import { getNaviBar } from './index';
import AdmPaymentReduxObj, { ShowMstFilterApplied } from '../../redux/AdmPayment';
import Skeleton from 'react-skeleton-loader';
import ControlledPopover from '../../components/custom/ControlledPopover';

class MstRecord extends RintagiScreen {
  constructor(props) {
    super(props);
    this.GetReduxState = ()=> (this.props.AdmPayment || {});
    this.blocker = null;
    this.titleSet = false;
    this.MstKeyColumnName = 'UsrId1';
    this.SystemName = 'FintruX';
    this.confirmUnload = this.confirmUnload.bind(this);
    this.hasChangedContent = false;
    this.setDirtyFlag = this.setDirtyFlag.bind(this);
    this.AutoCompleteFilterBy = (option, props) => { return true };
    this.OnModalReturn = this.OnModalReturn.bind(this);
    this.ValidatePage = this.ValidatePage.bind(this);
    this.SavePage = this.SavePage.bind(this);
    this.FieldChange = this.FieldChange.bind(this);
    this.DateChange = this.DateChange.bind(this);
    this.DropdownChange = this.DropdownChange.bind(this);
    this.mobileView = window.matchMedia('(max-width: 1200px)');
    this.mediaqueryresponse = this.mediaqueryresponse.bind(this);
    this.SubmitForm = ((submitForm, options = {}) => {
      const _this = this;
      return (evt) => {
        submitForm();
      }
    }
    );
    this.state = {
      submitting: false,
      ScreenButton: null,
      key: '',
      Buttons: {},
      ModalColor: '',
      ModalTitle: '',
      ModalMsg: '',
      ModalOpen: false,
      ModalSuccess: null,
      ModalCancel: null,
      isMobile: false,
    }
    if (!this.props.suppressLoadPage && this.props.history) {
      RememberCurrent('LastAppUrl', (this.props.history || {}).location, true);
    }

    if (!this.props.suppressLoadPage) {
      this.props.setSpinner(true);
    }
  }

  mediaqueryresponse(value) {
    if (value.matches) { // if media query matches
      this.setState({ isMobile: true });
    }
    else {
      this.setState({ isMobile: false });
    }
  }

 PaypalBtn({ submitForm, ScreenButton, naviBar, redirectTo, onSuccess }) {
return function (evt) {
this.OnClickColumeName = 'PaypalBtn';
//Enter Custom Code here, eg: submitForm();
evt.preventDefault();
}.bind(this);
}/* ReactRule: Master Record Custom Function */
/* ReactRule End: Master Record Custom Function */

  /* form related input handling */
//  PostToAp({ submitForm, ScreenButton, naviBar, redirectTo, onSuccess }) {
//    return function (evt) {
//      this.OnClickColumeName = 'PostToAp';
//      submitForm();
//      evt.preventDefault();
//    }.bind(this);
//  }

  ValidatePage(values) {
    const errors = {};
    const columnLabel = (this.props.AdmPayment || {}).ColumnLabel || {};
    /* standard field validation */
if (!values.cDescription) { errors.cDescription = (columnLabel.Description || {}).ErrMessage;}
if (!values.cItemDescription) { errors.cItemDescription = (columnLabel.ItemDescription || {}).ErrMessage;}
if (!values.cCurrency) { errors.cCurrency = (columnLabel.Currency || {}).ErrMessage;}
if (!values.cAmt) { errors.cAmt = (columnLabel.Amt || {}).ErrMessage;}
if (!values.cPayTo) { errors.cPayTo = (columnLabel.PayTo || {}).ErrMessage;}
    return errors;
  }

  SavePage(values, { setSubmitting, setErrors, resetForm, setFieldValue, setValues }) {
    const errors = [];
    const currMst = (this.props.AdmPayment || {}).Mst || {};
/* ReactRule: Master Record Save */
/* ReactRule End: Master Record Save */

// No need to generate this, put this in the webrule
//    if ((+(currMst.TrxTotal64)) === 0 && (this.ScreenButton || {}).buttonType === 'SaveClose') {
//      errors.push('Please add at least one expense.');
//    } else if ((this.ScreenButton || {}).buttonType === 'Save' && values.cTrxNote64 !== 'ENTER-PURPOSE-OF-THIS-EXPENSE') {
//      // errors.push('Please do not change the Memo on Chq if Save Only');
//      // setFieldValue('cTrxNote64', 'ENTER-PURPOSE-OF-THIS-EXPENSE');
//    } else if ((this.ScreenButton || {}).buttonType === 'SaveClose' && values.cTrxNote64 === 'ENTER-PURPOSE-OF-THIS-EXPENSE') {
//      errors.push('Please change the Memo on Chq if Save & Pay Me');
//    }
    if (errors.length > 0) {
      this.props.showNotification('E', { message: errors[0] });
      setSubmitting(false);
    }
    else {
      const { ScreenButton, OnClickColumeName } = this;
      this.setState({submittedOn: Date.now(), submitting: true, setSubmitting: setSubmitting, key: currMst.key, ScreenButton: ScreenButton, OnClickColumeName: OnClickColumeName });
      this.ScreenButton = null;
      this.OnClickColumeName = null;
      this.props.SavePage(
        this.props.AdmPayment,
        {
          UsrId1: values.cUsrId1|| '',
          LoginName1: values.cLoginName1|| '',
          Description: values.cDescription|| '',
          ItemDescription: values.cItemDescription|| '',
          Currency: values.cCurrency|| '',
          Amt: values.cAmt|| '',
          TaxAmt: values.cTaxAmt|| '',
          PayTo: values.cPayTo|| '',
          PayFrom: values.cPayFrom|| '',
          CCNbr: values.cCCNbr|| '',
          CCExpiryMonth: values.cCCExpiryMonth|| '',
          CCType: values.cCCType|| '',
          CCExpiryYear: values.cCCExpiryYear|| '',
          CCCVV: values.cCCCVV|| '',
        },
        [],
        {
          persist: true,
          ScreenButton: (ScreenButton || {}).buttonType,
          OnClickColumeName: OnClickColumeName,
        }
      );
    }
  }
  /* end of form related handling functions */

  /* standard screen button actions */
  SaveMst({ submitForm, ScreenButton }) {
    return function (evt) {
      this.ScreenButton = ScreenButton;
      submitForm();
    }.bind(this);
  }
  SaveCloseMst({ submitForm, ScreenButton, naviBar, redirectTo, onSuccess }) {
    return function (evt) {
      this.ScreenButton = ScreenButton;
      submitForm();
    }.bind(this);
  }
  NewSaveMst({ submitForm, ScreenButton }) {
    return function (evt) {
      this.ScreenButton = ScreenButton;
      submitForm();
    }.bind(this);
  }
  CopyHdr({ ScreenButton, mst, mstId, useMobileView }) {
    const AdmPaymentState = this.props.AdmPayment || {};
    const auxSystemLabels = AdmPaymentState.SystemLabel || {};
    return function (evt) {
      evt.preventDefault();
      const fromMstId = mstId || (mst || {}).UsrId1;
      const copyFn = () => {
        if (fromMstId) {
          this.props.AddMst(fromMstId, 'Mst', 0);
          /* this is application specific rule as the Posted flag needs to be reset */
          this.props.AdmPayment.Mst.Posted64 = 'N';
          if (useMobileView) {
            const naviBar = getNaviBar('Mst', {}, {}, this.props.AdmPayment.Label);
            this.props.history.push(getEditMstPath(getNaviPath(naviBar, 'Mst', '/'), '_'));
          }
          else {
            if (this.props.onCopy) this.props.onCopy();
          }
        }
        else {
          this.setState({ ModalOpen: true, ModalColor: 'warning', ModalTitle: auxSystemLabels.UnsavedPageTitle || '', ModalMsg: auxSystemLabels.UnsavedPageMsg || '' });
        }
      }
      if (!this.hasChangedContent) copyFn();
      else this.setState({ ModalOpen: true, ModalSuccess: copyFn, ModalColor: 'warning', ModalTitle: auxSystemLabels.UnsavedPageTitle || '', ModalMsg: auxSystemLabels.UnsavedPageMsg || '' });
    }.bind(this);
  }
  DelMst({ naviBar, ScreenButton, mst, mstId }) {
    const AdmPaymentState = this.props.AdmPayment || {};
    const auxSystemLabels = AdmPaymentState.SystemLabel || {};
    return function (evt) {
      evt.preventDefault();
      const deleteFn = () => {
        const fromMstId = mstId || mst.UsrId1;
        this.props.DelMst(this.props.AdmPayment, fromMstId);
      };
      this.setState({ ModalOpen: true, ModalSuccess: deleteFn, ModalColor: 'danger', ModalTitle: auxSystemLabels.WarningTitle || '', ModalMsg: auxSystemLabels.DeletePageMsg || '' });
    }.bind(this);
  }
  /* end of screen button action */

  /* react related stuff */
  static getDerivedStateFromProps(nextProps, prevState) {
    const nextReduxScreenState = nextProps.AdmPayment || {};
    const buttons = nextReduxScreenState.Buttons || {};
    const revisedButtonDef = super.GetScreenButtonDef(buttons, 'Mst', prevState);
    const currentKey = nextReduxScreenState.key;
    const waiting = nextReduxScreenState.page_saving || nextReduxScreenState.page_loading;
    let revisedState = {};
    if (revisedButtonDef) revisedState.Buttons = revisedButtonDef;

    if (prevState.submitting && !waiting && nextReduxScreenState.submittedOn > prevState.submittedOn) {
      prevState.setSubmitting(false);
    }

    return revisedState;
  }

  confirmUnload(message, callback) {
    const AdmPaymentState = this.props.AdmPayment || {};
    const auxSystemLabels = AdmPaymentState.SystemLabel || {};
    const confirm = () => {
      callback(true);
    }
    const cancel = () => {
      callback(false);
    }
    this.setState({ ModalOpen: true, ModalSuccess: confirm, ModalCancel: cancel, ModalColor: 'warning', ModalTitle: auxSystemLabels.UnsavedPageTitle || '', ModalMsg: message });
  }

  setDirtyFlag(dirty) {
    /* this is called during rendering but has side-effect, undesirable but only way to pass formik dirty flag around */
    if (dirty) {
      if (this.blocker) unregisterBlocker(this.blocker);
      this.blocker = this.confirmUnload;
      registerBlocker(this.confirmUnload);
    }
    else {
      if (this.blocker) unregisterBlocker(this.blocker);
      this.blocker = null;
    }
    if (this.props.updateChangedState) this.props.updateChangedState(dirty);
    this.SetCurrentRecordState(dirty);
    return true;
  }

  componentDidMount() {
    this.mediaqueryresponse(this.mobileView);
    this.mobileView.addListener(this.mediaqueryresponse) // attach listener function to listen in on state changes
    const isMobileView = this.state.isMobile;
    const useMobileView = (isMobileView && !(this.props.user || {}).desktopView);
    const suppressLoadPage = this.props.suppressLoadPage;
    if (!suppressLoadPage) {
      const { mstId } = { ...this.props.match.params };
      if (!(this.props.AdmPayment || {}).AuthCol || true) {
        this.props.LoadPage('Mst', { mstId: mstId || '_' });
      }
    }
    else {
      return;
    }
  }

  componentDidUpdate(prevprops, prevstates) {
    const currReduxScreenState = this.props.AdmPayment || {};

    if (!this.props.suppressLoadPage) {
      if (!currReduxScreenState.page_loading && this.props.global.pageSpinner) {
        const _this = this;
        setTimeout(() => _this.props.setSpinner(false), 500);
      }
    }

    const currMst = currReduxScreenState.Mst || {};
    this.SetPageTitle(currReduxScreenState);
    if (prevstates.key !== currMst.key) {
      if ((prevstates.ScreenButton || {}).buttonType === 'SaveClose') {
        const currDtl = currReduxScreenState.EditDtl || {};
        const dtlList = (currReduxScreenState.DtlList || {}).data || [];
        const naviBar = getNaviBar('Mst', currMst, currDtl, currReduxScreenState.Label);
        const searchListPath = getDefaultPath(getNaviPath(naviBar, 'MstList', '/'))
        this.props.history.push(searchListPath);
      }
    }
  }

  componentWillUnmount() {
    if (this.blocker) {
      unregisterBlocker(this.blocker);
      this.blocker = null;
    }
    this.mobileView.removeListener(this.mediaqueryresponse);
  }


  render() {
    const AdmPaymentState = this.props.AdmPayment || {};

    if (AdmPaymentState.access_denied) {
      return <Redirect to='/error' />;
    }

    const screenHlp = AdmPaymentState.ScreenHlp;

    // Labels
    const siteTitle = (this.props.global || {}).pageTitle || '';
    const MasterRecTitle = ((screenHlp || {}).MasterRecTitle || '');
    const MasterRecSubtitle = ((screenHlp || {}).MasterRecSubtitle || '');

    const screenButtons = AdmPaymentReduxObj.GetScreenButtons(AdmPaymentState) || {};
    const itemList = AdmPaymentState.Dtl || [];
    const auxLabels = AdmPaymentState.Label || {};
    const auxSystemLabels = AdmPaymentState.SystemLabel || {};

    const columnLabel = AdmPaymentState.ColumnLabel || {};
    const authCol = this.GetAuthCol(AdmPaymentState);
    const authRow = (AdmPaymentState.AuthRow || [])[0] || {};
    const currMst = ((this.props.AdmPayment || {}).Mst || {});
    const currDtl = ((this.props.AdmPayment || {}).EditDtl || {});
    const naviBar = getNaviBar('Mst', currMst, currDtl, screenButtons).filter(v => ((v.type !== 'Dtl' && v.type !== 'DtlList') || currMst.UsrId1));
    const selectList = AdmPaymentReduxObj.SearchListToSelectList(AdmPaymentState);
    const selectedMst = (selectList || []).filter(v => v.isSelected)[0] || {};
const UsrId1 = currMst.UsrId1;
const LoginName1 = currMst.LoginName1;
const Description = currMst.Description;
const ItemDescription = currMst.ItemDescription;
const Currency = currMst.Currency;
const Amt = currMst.Amt;
const TaxAmt = currMst.TaxAmt;
const PayTo = currMst.PayTo;
const PayFrom = currMst.PayFrom;
const CCNbr = currMst.CCNbr;
const CCExpiryMonth = currMst.CCExpiryMonth;
const CCType = currMst.CCType;
const CCExpiryYear = currMst.CCExpiryYear;
const CCCVV = currMst.CCCVV;

    const { dropdownMenuButtonList, bottomButtonList, hasDropdownMenuButton, hasBottomButton, hasRowButton } = this.state.Buttons;
    const hasActableButtons = hasBottomButton || hasRowButton || hasDropdownMenuButton;

    const isMobileView = this.state.isMobile;
    const useMobileView = (isMobileView && !(this.props.user || {}).desktopView);
/* ReactRule: Master Render */
/* ReactRule End: Master Render */

    return (
      <DocumentTitle title={siteTitle}>
        <div>
          <ModalDialog color={this.state.ModalColor} title={this.state.ModalTitle} onChange={this.OnModalReturn} ModalOpen={this.state.ModalOpen} message={this.state.ModalMsg} />
          <div className='account'>
            <div className='account__wrapper account-col'>
              <div className='account__card shadow-box rad-4'>
                {/* {!useMobileView && this.constructor.ShowSpinner(AdmPaymentState) && <div className='panel__refresh'></div>} */}
                {useMobileView && <div className='tabs tabs--justify tabs--bordered-bottom'>
                  <div className='tabs__wrap'>
                    <NaviBar history={this.props.history} navi={naviBar} />
                  </div>
                </div>}
                <p className='project-title-mobile mb-10'>{siteTitle.substring(0, document.title.indexOf('-') - 1)}</p>
                <Formik
                  initialValues={{
                  cUsrId1: UsrId1 || '',
                  cLoginName1: LoginName1 || '',
                  cDescription: Description || '',
                  cItemDescription: ItemDescription || '',
                  cCurrency: Currency || '',
                  cAmt: Amt || '',
                  cTaxAmt: TaxAmt || '',
                  cPayTo: PayTo || '',
                  cPayFrom: PayFrom || '',
                  cCCNbr: CCNbr || '',
                  cCCExpiryMonth: CCExpiryMonth || '',
                  cCCType: CCType || '',
                  cCCExpiryYear: CCExpiryYear || '',
                  cCCCVV: CCCVV || '',
                  }}
                  validate={this.ValidatePage}
                  onSubmit={this.SavePage}
                  key={currMst.key}
                  render={({
                    values,
                    errors,
                    touched,
                    isSubmitting,
                    dirty,
                    setFieldValue,
                    setFieldTouched,
                    handleChange,
                    submitForm
                  }) => (
                      <div>
                        {this.setDirtyFlag(dirty) &&
                          <Prompt
                            when={dirty}
                            message={auxSystemLabels.UnsavedPageMsg || ''}
                          />
                        }
                        <div className='account__head'>
                          <Row>
                            <Col xs={useMobileView ? 9 : 8}>
                              <h3 className='account__title'>{MasterRecTitle}</h3>
                              <h4 className='account__subhead subhead'>{MasterRecSubtitle}</h4>
                            </Col>
                            <Col xs={useMobileView ? 3 : 4}>
                              <ButtonToolbar className='f-right'>
                                {(this.constructor.ShowSpinner(AdmPaymentState) && <Skeleton height='40px' />) ||
                                  <UncontrolledDropdown>
                                    <ButtonGroup className='btn-group--icons'>
                                      <i className={dirty ? 'fa fa-exclamation exclamation-icon' : ''}></i>
                                      {
                                        dropdownMenuButtonList.filter(v => !v.expose && !this.ActionSuppressed(authRow, v.buttonType, (currMst || {}).UsrId1)).length > 0 &&
                                        <DropdownToggle className='mw-50' outline>
                                          <i className='fa fa-ellipsis-h icon-holder'></i>
                                          {!useMobileView && <p className='action-menu-label'>{(screenButtons.More || {}).label}</p>}
                                        </DropdownToggle>
                                      }
                                    </ButtonGroup>
                                    {
                                      dropdownMenuButtonList.filter(v => !v.expose).length > 0 &&
                                      <DropdownMenu right className={`dropdown__menu dropdown-options`}>
                                        {
                                          dropdownMenuButtonList.filter(v => !v.expose).map(v => {
                                            if (this.ActionSuppressed(authRow, v.buttonType, (currMst || {}).UsrId1)) return null;
                                            return (
                                              <DropdownItem key={v.tid || v.order} onClick={this.ScreenButtonAction[v.buttonType]({ naviBar, submitForm, ScreenButton: v, mst: currMst, dtl: currDtl, useMobileView })} className={`${v.className}`}><i className={`${v.iconClassName} mr-10`}></i>{v.label}</DropdownItem>)
                                          })
                                        }
                                      </DropdownMenu>
                                    }
                                  </UncontrolledDropdown>
                                }
                              </ButtonToolbar>
                            </Col>
                          </Row>
                        </div>
                        <Form className='form'> {/* this line equals to <form className='form' onSubmit={handleSubmit} */}

                          <div className='w-100'>
                            <Row>
            {(authCol.UsrId1 || {}).visible &&
 <Col lg={6} xl={6}>
<div className='form__form-group'>
{((true && this.constructor.ShowSpinner(AdmPaymentState)) && <Skeleton height='20px' />) ||
<label className='form__form-group-label'>{(columnLabel.UsrId1 || {}).ColumnHeader} {(columnLabel.UsrId1 || {}).ToolTip && 
 (<ControlledPopover id={(columnLabel.UsrId1 || {}).ColumnName} className='sticky-icon pt-0 lh-23' message= {(columnLabel.UsrId1 || {}).ToolTip} />
)}
</label>
}
{((true && this.constructor.ShowSpinner(AdmPaymentState)) && <Skeleton height='36px' />) ||
<div className='form__form-group-field'>
<Field
type='text'
name='cUsrId1'
disabled = {(authCol.UsrId1 || {}).readonly ? 'disabled': '' }/>
</div>
}
{errors.cUsrId1 && touched.cUsrId1 && <span className='form__form-group-error'>{errors.cUsrId1}</span>}
</div>
</Col>
}
{(authCol.LoginName1 || {}).visible &&
 <Col lg={6} xl={6}>
<div className='form__form-group'>
{((true && this.constructor.ShowSpinner(AdmPaymentState)) && <Skeleton height='20px' />) ||
<label className='form__form-group-label'>{(columnLabel.LoginName1 || {}).ColumnHeader} {(columnLabel.LoginName1 || {}).ToolTip && 
 (<ControlledPopover id={(columnLabel.LoginName1 || {}).ColumnName} className='sticky-icon pt-0 lh-23' message= {(columnLabel.LoginName1 || {}).ToolTip} />
)}
</label>
}
{((true && this.constructor.ShowSpinner(AdmPaymentState)) && <Skeleton height='36px' />) ||
<div className='form__form-group-field'>
<Field
type='text'
name='cLoginName1'
disabled = {(authCol.LoginName1 || {}).readonly ? 'disabled': '' }/>
</div>
}
{errors.cLoginName1 && touched.cLoginName1 && <span className='form__form-group-error'>{errors.cLoginName1}</span>}
</div>
</Col>
}
{(authCol.Description || {}).visible &&
 <Col lg={6} xl={6}>
<div className='form__form-group'>
{((true && this.constructor.ShowSpinner(AdmPaymentState)) && <Skeleton height='20px' />) ||
<label className='form__form-group-label'>{(columnLabel.Description || {}).ColumnHeader} <span className='text-danger'>*</span>{(columnLabel.Description || {}).ToolTip && 
 (<ControlledPopover id={(columnLabel.Description || {}).ColumnName} className='sticky-icon pt-0 lh-23' message= {(columnLabel.Description || {}).ToolTip} />
)}
</label>
}
{((true && this.constructor.ShowSpinner(AdmPaymentState)) && <Skeleton height='36px' />) ||
<div className='form__form-group-field'>
<Field
type='text'
name='cDescription'
disabled = {(authCol.Description || {}).readonly ? 'disabled': '' }/>
</div>
}
{errors.cDescription && touched.cDescription && <span className='form__form-group-error'>{errors.cDescription}</span>}
</div>
</Col>
}
{(authCol.ItemDescription || {}).visible &&
 <Col lg={6} xl={6}>
<div className='form__form-group'>
{((true && this.constructor.ShowSpinner(AdmPaymentState)) && <Skeleton height='20px' />) ||
<label className='form__form-group-label'>{(columnLabel.ItemDescription || {}).ColumnHeader} <span className='text-danger'>*</span>{(columnLabel.ItemDescription || {}).ToolTip && 
 (<ControlledPopover id={(columnLabel.ItemDescription || {}).ColumnName} className='sticky-icon pt-0 lh-23' message= {(columnLabel.ItemDescription || {}).ToolTip} />
)}
</label>
}
{((true && this.constructor.ShowSpinner(AdmPaymentState)) && <Skeleton height='36px' />) ||
<div className='form__form-group-field'>
<Field
type='text'
name='cItemDescription'
disabled = {(authCol.ItemDescription || {}).readonly ? 'disabled': '' }/>
</div>
}
{errors.cItemDescription && touched.cItemDescription && <span className='form__form-group-error'>{errors.cItemDescription}</span>}
</div>
</Col>
}
{(authCol.Currency || {}).visible &&
 <Col lg={6} xl={6}>
<div className='form__form-group'>
{((true && this.constructor.ShowSpinner(AdmPaymentState)) && <Skeleton height='20px' />) ||
<label className='form__form-group-label'>{(columnLabel.Currency || {}).ColumnHeader} <span className='text-danger'>*</span>{(columnLabel.Currency || {}).ToolTip && 
 (<ControlledPopover id={(columnLabel.Currency || {}).ColumnName} className='sticky-icon pt-0 lh-23' message= {(columnLabel.Currency || {}).ToolTip} />
)}
</label>
}
{((true && this.constructor.ShowSpinner(AdmPaymentState)) && <Skeleton height='36px' />) ||
<div className='form__form-group-field'>
<Field
type='text'
name='cCurrency'
disabled = {(authCol.Currency || {}).readonly ? 'disabled': '' }/>
</div>
}
{errors.cCurrency && touched.cCurrency && <span className='form__form-group-error'>{errors.cCurrency}</span>}
</div>
</Col>
}
{(authCol.Amt || {}).visible &&
 <Col lg={6} xl={6}>
<div className='form__form-group'>
{((true && this.constructor.ShowSpinner(AdmPaymentState)) && <Skeleton height='20px' />) ||
<label className='form__form-group-label'>{(columnLabel.Amt || {}).ColumnHeader} <span className='text-danger'>*</span>{(columnLabel.Amt || {}).ToolTip && 
 (<ControlledPopover id={(columnLabel.Amt || {}).ColumnName} className='sticky-icon pt-0 lh-23' message= {(columnLabel.Amt || {}).ToolTip} />
)}
</label>
}
{((true && this.constructor.ShowSpinner(AdmPaymentState)) && <Skeleton height='36px' />) ||
<div className='form__form-group-field'>
<Field
type='text'
name='cAmt'
disabled = {(authCol.Amt || {}).readonly ? 'disabled': '' }/>
</div>
}
{errors.cAmt && touched.cAmt && <span className='form__form-group-error'>{errors.cAmt}</span>}
</div>
</Col>
}
{(authCol.TaxAmt || {}).visible &&
 <Col lg={6} xl={6}>
<div className='form__form-group'>
{((true && this.constructor.ShowSpinner(AdmPaymentState)) && <Skeleton height='20px' />) ||
<label className='form__form-group-label'>{(columnLabel.TaxAmt || {}).ColumnHeader} {(columnLabel.TaxAmt || {}).ToolTip && 
 (<ControlledPopover id={(columnLabel.TaxAmt || {}).ColumnName} className='sticky-icon pt-0 lh-23' message= {(columnLabel.TaxAmt || {}).ToolTip} />
)}
</label>
}
{((true && this.constructor.ShowSpinner(AdmPaymentState)) && <Skeleton height='36px' />) ||
<div className='form__form-group-field'>
<Field
type='text'
name='cTaxAmt'
disabled = {(authCol.TaxAmt || {}).readonly ? 'disabled': '' }/>
</div>
}
{errors.cTaxAmt && touched.cTaxAmt && <span className='form__form-group-error'>{errors.cTaxAmt}</span>}
</div>
</Col>
}
{(authCol.PayTo || {}).visible &&
 <Col lg={6} xl={6}>
<div className='form__form-group'>
{((true && this.constructor.ShowSpinner(AdmPaymentState)) && <Skeleton height='20px' />) ||
<label className='form__form-group-label'>{(columnLabel.PayTo || {}).ColumnHeader} <span className='text-danger'>*</span>{(columnLabel.PayTo || {}).ToolTip && 
 (<ControlledPopover id={(columnLabel.PayTo || {}).ColumnName} className='sticky-icon pt-0 lh-23' message= {(columnLabel.PayTo || {}).ToolTip} />
)}
</label>
}
{((true && this.constructor.ShowSpinner(AdmPaymentState)) && <Skeleton height='36px' />) ||
<div className='form__form-group-field'>
<Field
type='text'
name='cPayTo'
disabled = {(authCol.PayTo || {}).readonly ? 'disabled': '' }/>
</div>
}
{errors.cPayTo && touched.cPayTo && <span className='form__form-group-error'>{errors.cPayTo}</span>}
</div>
</Col>
}
{(authCol.PayFrom || {}).visible &&
 <Col lg={6} xl={6}>
<div className='form__form-group'>
{((true && this.constructor.ShowSpinner(AdmPaymentState)) && <Skeleton height='20px' />) ||
<label className='form__form-group-label'>{(columnLabel.PayFrom || {}).ColumnHeader} {(columnLabel.PayFrom || {}).ToolTip && 
 (<ControlledPopover id={(columnLabel.PayFrom || {}).ColumnName} className='sticky-icon pt-0 lh-23' message= {(columnLabel.PayFrom || {}).ToolTip} />
)}
</label>
}
{((true && this.constructor.ShowSpinner(AdmPaymentState)) && <Skeleton height='36px' />) ||
<div className='form__form-group-field'>
<Field
type='text'
name='cPayFrom'
disabled = {(authCol.PayFrom || {}).readonly ? 'disabled': '' }/>
</div>
}
{errors.cPayFrom && touched.cPayFrom && <span className='form__form-group-error'>{errors.cPayFrom}</span>}
</div>
</Col>
}
<Col lg={6} xl={6}>
<div className='form__form-group'>
<div className='d-block'>
{(authCol.PaypalBtn || {}).visible && <Button color='secondary' size='sm' className='admin-ap-post-btn mb-10' disabled={(authCol.PaypalBtn || {}).readonly || !(authCol.PaypalBtn || {}).visible} onClick={this.PaypalBtn({ naviBar, submitForm, currMst })} >{auxLabels.PaypalBtn || (columnLabel.PaypalBtn || {}).ColumnName}</Button>}
</div>
</div>
</Col>
{(authCol.PaypalPayoutBtn || {}).visible &&
 <Col lg={6} xl={6}>
<div className='form__form-group'>
{((true && this.constructor.ShowSpinner(AdmPaymentState)) && <Skeleton height='20px' />) ||
<label className='form__form-group-label'>{(columnLabel.PaypalPayoutBtn || {}).ColumnHeader} {(columnLabel.PaypalPayoutBtn || {}).ToolTip && 
 (<ControlledPopover id={(columnLabel.PaypalPayoutBtn || {}).ColumnName} className='sticky-icon pt-0 lh-23' message= {(columnLabel.PaypalPayoutBtn || {}).ToolTip} />
)}
</label>
}
</div>
</Col>
}
{(authCol.CCNbr || {}).visible &&
 <Col lg={6} xl={6}>
<div className='form__form-group'>
{((true && this.constructor.ShowSpinner(AdmPaymentState)) && <Skeleton height='20px' />) ||
<label className='form__form-group-label'>{(columnLabel.CCNbr || {}).ColumnHeader} {(columnLabel.CCNbr || {}).ToolTip && 
 (<ControlledPopover id={(columnLabel.CCNbr || {}).ColumnName} className='sticky-icon pt-0 lh-23' message= {(columnLabel.CCNbr || {}).ToolTip} />
)}
</label>
}
{((true && this.constructor.ShowSpinner(AdmPaymentState)) && <Skeleton height='36px' />) ||
<div className='form__form-group-field'>
<Field
type='text'
name='cCCNbr'
disabled = {(authCol.CCNbr || {}).readonly ? 'disabled': '' }/>
</div>
}
{errors.cCCNbr && touched.cCCNbr && <span className='form__form-group-error'>{errors.cCCNbr}</span>}
</div>
</Col>
}
{(authCol.CCExpiryMonth || {}).visible &&
 <Col lg={6} xl={6}>
<div className='form__form-group'>
{((true && this.constructor.ShowSpinner(AdmPaymentState)) && <Skeleton height='20px' />) ||
<label className='form__form-group-label'>{(columnLabel.CCExpiryMonth || {}).ColumnHeader} {(columnLabel.CCExpiryMonth || {}).ToolTip && 
 (<ControlledPopover id={(columnLabel.CCExpiryMonth || {}).ColumnName} className='sticky-icon pt-0 lh-23' message= {(columnLabel.CCExpiryMonth || {}).ToolTip} />
)}
</label>
}
{((true && this.constructor.ShowSpinner(AdmPaymentState)) && <Skeleton height='36px' />) ||
<div className='form__form-group-field'>
<Field
type='text'
name='cCCExpiryMonth'
disabled = {(authCol.CCExpiryMonth || {}).readonly ? 'disabled': '' }/>
</div>
}
{errors.cCCExpiryMonth && touched.cCCExpiryMonth && <span className='form__form-group-error'>{errors.cCCExpiryMonth}</span>}
</div>
</Col>
}
{(authCol.PaypalCCBtn || {}).visible &&
 <Col lg={6} xl={6}>
<div className='form__form-group'>
{((true && this.constructor.ShowSpinner(AdmPaymentState)) && <Skeleton height='20px' />) ||
<label className='form__form-group-label'>{(columnLabel.PaypalCCBtn || {}).ColumnHeader} {(columnLabel.PaypalCCBtn || {}).ToolTip && 
 (<ControlledPopover id={(columnLabel.PaypalCCBtn || {}).ColumnName} className='sticky-icon pt-0 lh-23' message= {(columnLabel.PaypalCCBtn || {}).ToolTip} />
)}
</label>
}
</div>
</Col>
}
{(authCol.CCType || {}).visible &&
 <Col lg={6} xl={6}>
<div className='form__form-group'>
{((true && this.constructor.ShowSpinner(AdmPaymentState)) && <Skeleton height='20px' />) ||
<label className='form__form-group-label'>{(columnLabel.CCType || {}).ColumnHeader} {(columnLabel.CCType || {}).ToolTip && 
 (<ControlledPopover id={(columnLabel.CCType || {}).ColumnName} className='sticky-icon pt-0 lh-23' message= {(columnLabel.CCType || {}).ToolTip} />
)}
</label>
}
{((true && this.constructor.ShowSpinner(AdmPaymentState)) && <Skeleton height='36px' />) ||
<div className='form__form-group-field'>
<Field
type='text'
name='cCCType'
disabled = {(authCol.CCType || {}).readonly ? 'disabled': '' }/>
</div>
}
{errors.cCCType && touched.cCCType && <span className='form__form-group-error'>{errors.cCCType}</span>}
</div>
</Col>
}
{(authCol.CCExpiryYear || {}).visible &&
 <Col lg={6} xl={6}>
<div className='form__form-group'>
{((true && this.constructor.ShowSpinner(AdmPaymentState)) && <Skeleton height='20px' />) ||
<label className='form__form-group-label'>{(columnLabel.CCExpiryYear || {}).ColumnHeader} {(columnLabel.CCExpiryYear || {}).ToolTip && 
 (<ControlledPopover id={(columnLabel.CCExpiryYear || {}).ColumnName} className='sticky-icon pt-0 lh-23' message= {(columnLabel.CCExpiryYear || {}).ToolTip} />
)}
</label>
}
{((true && this.constructor.ShowSpinner(AdmPaymentState)) && <Skeleton height='36px' />) ||
<div className='form__form-group-field'>
<Field
type='text'
name='cCCExpiryYear'
disabled = {(authCol.CCExpiryYear || {}).readonly ? 'disabled': '' }/>
</div>
}
{errors.cCCExpiryYear && touched.cCCExpiryYear && <span className='form__form-group-error'>{errors.cCCExpiryYear}</span>}
</div>
</Col>
}
{(authCol.CCCVV || {}).visible &&
 <Col lg={6} xl={6}>
<div className='form__form-group'>
{((true && this.constructor.ShowSpinner(AdmPaymentState)) && <Skeleton height='20px' />) ||
<label className='form__form-group-label'>{(columnLabel.CCCVV || {}).ColumnHeader} {(columnLabel.CCCVV || {}).ToolTip && 
 (<ControlledPopover id={(columnLabel.CCCVV || {}).ColumnName} className='sticky-icon pt-0 lh-23' message= {(columnLabel.CCCVV || {}).ToolTip} />
)}
</label>
}
{((true && this.constructor.ShowSpinner(AdmPaymentState)) && <Skeleton height='36px' />) ||
<div className='form__form-group-field'>
<Field
type='text'
name='cCCCVV'
disabled = {(authCol.CCCVV || {}).readonly ? 'disabled': '' }/>
</div>
}
{errors.cCCCVV && touched.cCCCVV && <span className='form__form-group-error'>{errors.cCCCVV}</span>}
</div>
</Col>
}
                            </Row>
                          </div>
                          <div className='form__form-group mart-5 mb-0'>
                            <Row className='btn-bottom-row'>
                              {useMobileView && <Col xs={3} sm={2} className='btn-bottom-column'>
                                <Button color='success' className='btn btn-outline-success account__btn' onClick={this.props.history.goBack} outline><i className='fa fa-long-arrow-left'></i></Button>
                              </Col>}
                              <Col
                                xs={useMobileView ? 9 : 12}
                                sm={useMobileView ? 10 : 12}>
                                <Row>
                                  {
                                    bottomButtonList
                                      .filter(v => v.expose)
                                      .map((v, i, a) => {
                                        if (this.ActionSuppressed(authRow, v.buttonType, (currMst || {}).UsrId1)) return null;
                                        const buttonCount = a.length - a.filter(x => this.ActionSuppressed(authRow, x.buttonType, (currMst || {}).UsrId1));
                                        const colWidth = parseInt(12 / buttonCount, 10);
                                        const lastBtn = i === (a.length - 1);
                                        const outlineProperty = lastBtn ? false : true;
                                        return (
                                          <Col key={v.tid || v.order} xs={colWidth} sm={colWidth} className='btn-bottom-column' >
                                            {(this.constructor.ShowSpinner(AdmPaymentState) && <Skeleton height='43px' />) ||
                                              <Button color='success' type='button' outline={outlineProperty} className='account__btn' disabled={isSubmitting} onClick={this.ScreenButtonAction[v.buttonType]({ naviBar, submitForm, ScreenButton: v, mst: currMst, useMobileView })}>{v.label}</Button>
                                            }
                                          </Col>
                                        )
                                      })
                                  }
                                </Row>
                              </Col>
                            </Row>
                          </div>
                        </Form>
                      </div>
                    )}
                />
              </div>
            </div>
          </div>
        </div>
      </DocumentTitle>
    );
  };
};

const mapStateToProps = (state) => ({
  user: (state.auth || {}).user,
  error: state.error,
  AdmPayment: state.AdmPayment,
  global: state.global,
});

const mapDispatchToProps = (dispatch) => (
  bindActionCreators(Object.assign({},
    { LoadPage: AdmPaymentReduxObj.LoadPage.bind(AdmPaymentReduxObj) },
    { SavePage: AdmPaymentReduxObj.SavePage.bind(AdmPaymentReduxObj) },
    { DelMst: AdmPaymentReduxObj.DelMst.bind(AdmPaymentReduxObj) },
    { AddMst: AdmPaymentReduxObj.AddMst.bind(AdmPaymentReduxObj) },
//    { SearchMemberId64: AdmPaymentReduxObj.SearchActions.SearchMemberId64.bind(AdmPaymentReduxObj) },
//    { SearchCurrencyId64: AdmPaymentReduxObj.SearchActions.SearchCurrencyId64.bind(AdmPaymentReduxObj) },
//    { SearchCustomerJobId64: AdmPaymentReduxObj.SearchActions.SearchCustomerJobId64.bind(AdmPaymentReduxObj) },

    { showNotification: showNotification },
    { setTitle: setTitle },
    { setSpinner: setSpinner },
  ), dispatch)
)

export default connect(mapStateToProps, mapDispatchToProps)(MstRecord);

            