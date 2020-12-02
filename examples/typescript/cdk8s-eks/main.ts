import * as cdk8s from 'cdk8s';
import * as kplus from 'cdk8s-plus-17';
import * as cdk from '@aws-cdk/core';
import * as sns from '@aws-cdk/aws-sns';
import * as sqs from '@aws-cdk/aws-sqs';
import * as eks from '@aws-cdk/aws-eks';
import * as elastic from '@aws-cdk/aws-elasticsearch';
import * as subs from '@aws-cdk/aws-sns-subscriptions';
import { Construct } from 'constructs';

export interface MyChartProps {

  readonly queue: sqs.Queue;

  readonly domain: elastic.Domain;

}

export class MyChart extends cdk8s.Chart {
  constructor(scope: Construct, id: string, props: MyChartProps) {
    super(scope, id);

    new kplus.Deployment(this, 'Deployment', {
      containers: [{
        image: 'alpine',
        env: {
          QUEUE_NAME: kplus.EnvValue.fromValue(props.queue.queueName),
          DOMAIN_ENDPOINT: kplus.EnvValue.fromValue(props.domain.domainEndpoint),
        },
        command: ['/bin/sh', '-c', 'while true; do echo Reading events from ${QUEUE_NAME} and indexing them to ${DOMAIN_ENDPOINT}; sleep 2; done']
      }]
    });

  }
}

export class MyStack extends cdk.Stack {

  public readonly cluster: eks.Cluster;
  public readonly queue: sqs.Queue;
  public readonly domain: elastic.Domain;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.domain = new elastic.Domain(this, 'Domain', { version: elastic.ElasticsearchVersion.V7_7 });
    this.queue = new sqs.Queue(this, 'Queue');
    this.cluster = new eks.Cluster(this, 'Cluster', { version: eks.KubernetesVersion.V1_18 });

    const topic = new sns.Topic(this, 'Topic');
    topic.addSubscription(new subs.SqsSubscription(this.queue));

  }
}

const cdkApp = new cdk.App();
const cdk8sApp = new cdk8s.App();

const stack = new MyStack(cdk8sApp, 'Indexer');
const chart = new MyChart(cdk8sApp, 'indexer-chart', {
  queue: stack.queue,
  domain: stack.domain,
});

stack.cluster.addCdk8sChart('Indexer', chart)

cdkApp.synth();
