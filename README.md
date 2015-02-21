# Blocks
A simple server management tool

Ideas:
- Minecraft
- Teamspeak
- World of Warcraft (private server)

Minecraft:
- Do all the logic through the plugins, basically the web ui would just send commands to the plugins
- Use SOAP/REST API to interact with server
- Server must have the matching plugin installed
- Backup maps, restore backups
	- Download backup and upload through POST form
- Authentication would be required to use the API
- Add plugins from Bukkit official repo, remove plugins, edit configurations files...
- Update server jar archive
	- must work out technical details
	- have the plugin pull the latest craftbukkit/spiggot/whatever in the right folder on user demand
	- pop up to say that a new server version is available (only support one server provider for easiness sakes
- map of all users
- edit server properties
- run commands directly
- see console output (live ajax communication, websocket ? <3)

GUI:
- Regroup features in a side menu (that we could hide/show as necessary)

