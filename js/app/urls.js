/**
 * 说明：请求的url
 * Created by wangguangkai on 2016/12/1.
 */

var mpUrlsObj = {
  thereDomainName: 'http://heretest',//三级域名
  idsThereDomainName: 'http://tuser',
};
mpUrlsObj.domainHead = mpUrlsObj.thereDomainName + '.haier.com/';//域名，将来分环境
mpUrlsObj.idsDomainHead = mpUrlsObj.idsThereDomainName + '.haier.com/';//域名，将来分环境
mpUrlsObj.brMkt = {
  applyMarketAccount: mpUrlsObj.domainHead + 'ad/user/applyMarketAccount',
  queryUser: mpUrlsObj.domainHead + 'ad/common/queryUser',
  bindMobile: mpUrlsObj.idsDomainHead + 'HaierFramework/haier/appuser/vipUser/bindmobile.jsp',
  bindEmail: mpUrlsObj.idsDomainHead + 'HaierFramework/haier/appuser/vipUser/bindemail.jsp',
};