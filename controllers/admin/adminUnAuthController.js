async function renderAdminIndexPage(req, res) {
  return res.render("admin/adminIndexPage");
}
async function renderAdminSigninPage(req, res) {
  return res.render("admin/adminSigninPage");
}



module.exports = {
  renderAdminIndexPage,
  renderAdminSigninPage,
 
};
