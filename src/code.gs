const SPREAD_SHEET_ID = 'XXXXXXXXXXX';
const TITLE = '勤怠管理';

const doGet = () => {
  const html = HtmlService.createTemplateFromFile('index.html');
  html.members = getMembers();
  return html.evaluate()
    .setTitle(TITLE)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
};

const include = (filename) => {
  return HtmlService.createHtmlOutputFromFile(filename)
      .getContent();
};

const sheet = SpreadsheetApp.openById(SPREAD_SHEET_ID);

const writeData = (date, member, status) => {
  const lastRaw = sheet.getLastRow() + 1;
  // 時刻
  sheet.getRange('A' + lastRaw).setValue(date);
  sheet.getRange('B' + lastRaw).setValue(member.id);
  sheet.getRange('C' + lastRaw).setValue(member.name);
  sheet.getRange('D' + lastRaw).setValue(status);
};

const getMembers = () => {
  //データ取得するシート（membersシートを指定）
  const sheet = SpreadsheetApp.openById(SPREAD_SHEET_ID).getSheetByName('members');

  //行（横軸）と列（縦軸）の最大数を取得
  const maxRow = sheet.getLastRow();
  const maxColumn = sheet.getLastColumn();

  //JSON用のkey
  const keys = [];

  //データ格納配列
  const data = [];

  //1行目のkeyの名前取得 keyの行を変更したい場合はxと引数を変更
  //JSON用のラベルは1行目で指定しているため【getRange】の第1引数は【1】
  for (let x = 1; x <= maxColumn; x++) {
    keys.push(sheet.getRange(1, x).getValue());
  }

  //データの取得
  //実際のデータが2行目からなので【y = 2】から開始
  for (let y = 2; y <= maxRow; y++) {
    // var json_shop_id = {};
    const json = {};

    for (let x = 1; x <= maxColumn; x++) {
      json[keys[x-1]] = sheet.getRange(y, x).getValue();
    }
    //データ格納
    data.push(json);
    Logger.log(data);
  }

  //整形してテキストにします
  return JSON.stringify(data, null, '\t');
};

const getMembersHtml = () => {
  const members = JSON.parse(getMembers());
  //const members = getMembers();
  let html = "";
  members.forEach(person => {
    html += '<button onclick="openModal()">' + person.name + "</button>";
    console.log(person.id, person.name);
  })
  return html;
};

const getNow = () => {
  const date = new Date();
  now = Utilities.formatDate(date, "Asia/Tokyo", "yyyy/MM/dd HH:mm");
  return now;
};
