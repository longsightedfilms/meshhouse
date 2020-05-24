export default {
  '>=0.2.6': ((dcc: any): void => {
    dcc.set('threedCoat.useSystemAssociation', true)
    dcc.set('threedCoat.customPath', '')
    dcc.set('substancePainter.useSystemAssociation', true)
    dcc.set('substancePainter.customPath', '')
  })
}
