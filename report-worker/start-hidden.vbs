' Runs start.cmd with no console window. Used by the "GTP report worker" logon task.
Set sh = CreateObject("WScript.Shell")
sh.Run "cmd /c """ & Replace(WScript.ScriptFullName, WScript.ScriptName, "start.cmd") & """", 0, False
