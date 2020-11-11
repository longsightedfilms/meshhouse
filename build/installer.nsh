!macro customInstall
  DetailPrint "Register meshhouse URI Handler"
  DeleteRegKey HKCR "meshhouse"
  WriteRegStr HKCR "meshhouse" "" "URL:meshhouse"
  WriteRegStr HKCR "meshhouse" "URL Protocol" ""
  WriteRegStr HKCR "meshhouse\DefaultIcon" "" "$INSTDIR\${APP_EXECUTABLE_FILENAME}"
  WriteRegStr HKCR "meshhouse\shell" "" ""
  WriteRegStr HKCR "meshhouse\shell\Open" "" ""
  WriteRegStr HKCR "meshhouse\shell\Open\command" "" "$INSTDIR\${APP_EXECUTABLE_FILENAME} %1"
!macroend
