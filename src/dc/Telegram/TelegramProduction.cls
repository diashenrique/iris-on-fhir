Class dc.Telegram.TelegramProduction Extends Ens.Production
{

XData ProductionDefinition
{
<Production Name="dc.Telegram.TelegramProduction" LogGeneralTraceEvents="false">
  <Description></Description>
  <ActorPoolSize>2</ActorPoolSize>
  <Item Name="dc.Telegram.TelegramOperation" Category="" ClassName="dc.Telegram.TelegramOperation" PoolSize="1" Enabled="true" Foreground="false" Comment="" LogTraceEvents="false" Schedule="">
    <Setting Target="Adapter" Name="SSLConfiguration">ISC.FeatureTracker.SSL.Config</Setting>
    <Setting Target="Adapter" Name="TelegramToken">1743751074:AAF8_P8Mq7B-nVYfbITRTz2FsEdkIZhFP9E</Setting>
  </Item>
  <Item Name="dc.Telegram.TelegramService" Category="" ClassName="dc.Telegram.TelegramService" PoolSize="1" Enabled="true" Foreground="false" Comment="" LogTraceEvents="false" Schedule="">
    <Setting Target="Adapter" Name="SSLConfiguration">ISC.FeatureTracker.SSL.Config</Setting>
    <Setting Target="Adapter" Name="TelegramToken">1743751074:AAF8_P8Mq7B-nVYfbITRTz2FsEdkIZhFP9E</Setting>
  </Item>
</Production>
}

}
