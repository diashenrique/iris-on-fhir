Class dc.Telegram.Production Extends Ens.Production
{

XData ProductionDefinition
{
<Production Name="dc.Telegram.Production" LogGeneralTraceEvents="false">
  <Description></Description>
  <ActorPoolSize>2</ActorPoolSize>
  <Item Name="dc.Telegram.TelegramService" Category="" ClassName="dc.Telegram.TelegramService" PoolSize="1" Enabled="true" Foreground="false" Comment="" LogTraceEvents="false" Schedule="">
    <Setting Target="Adapter" Name="TelegramToken">1743751074:AAH5USzesyU-Ejd8v-fTS09LVxHMxy9R8dk</Setting>
    <Setting Target="Adapter" Name="SSLConfiguration">ISC.FeatureTracker.SSL.Config</Setting>
  </Item>
  <Item Name="dc.Telegram.TelegramOperation" Category="" ClassName="dc.Telegram.TelegramOperation" PoolSize="1" Enabled="true" Foreground="false" Comment="" LogTraceEvents="false" Schedule="">
    <Setting Target="Adapter" Name="TelegramToken">1743751074:AAH5USzesyU-Ejd8v-fTS09LVxHMxy9R8dk</Setting>
    <Setting Target="Adapter" Name="SSLConfiguration">ISC.FeatureTracker.SSL.Config</Setting>
  </Item>
</Production>
}

}
