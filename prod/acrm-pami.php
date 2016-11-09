<?php
require __DIR__ . '/vendor/autoload.php';

use PAMI\Client\Impl\ClientImpl as PamiClient;
use PAMI\Message\Event\EventMessage;
use PAMI\Listener\IEventListener;
use PAMI\Message\Event\HangupEvent;
use PAMI\Message\Event\NewchannelEvent;
use PAMI\Message\Event\ExtensionStatusEvent;
use PAMI\Message\Event\NewstateEvent;

$pamiClientOptions = array(
    'host' => '127.0.0.1',
    'scheme' => 'tcp://',
    'port' => 5038,
    'username' => 'admin',
    'secret' => 'tqrh16tqrh16',
    'connect_timeout' => 100,
    'read_timeout' => 100
);
$pamiClient = new PamiClient($pamiClientOptions);
// Open the connection
$pamiClient->open();

$pamiClient->registerEventListener(
    function (EventMessage $event) {
        try {
            $dbh = new PDO('mysql:host=127.0.0.1;dbname=asterisk', 'acrm', 'tqrh16');
            $stmt = $dbh->prepare('INSERT INTO acrm (uniqueid,channel,state,statedesc,src,dst,event) VALUES(:uniqueid,:channel,:state,:statedesc,:src,:dst,:event)');
            $stmt->execute(array(
                'uniqueid' => $event->getUniqueID(),
                'channel' => $event->getChannel(),
                'state' => $event->getChannelState(),
                'statedesc' => $event->getChannelStateDesc(),
                'src' => $event->getCallerIDNum(),
                'dst' => $event->getKey('exten'),
                'event' => 'not yet'
                ));
            $dbh = null;
        } catch (PDOException $e) {
            print "Error!: " . $e->getMessage() . "<br/>";
            die();
        }
        //var_dump($event);
    },
    function (EventMessage $event) {
        return
            ($event instanceof NewchannelEvent) xor ($event instanceof ExtensionStatusEvent) xor ($event instanceof NewstateEvent);
    }
);

$running = true;
// Main loop
while($running) {
    $pamiClient->process();
    usleep(1000);
}
// Close the connection
$pamiClient->close();
