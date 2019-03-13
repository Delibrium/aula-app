<template>
   <div class="quorum-info">
     <div v-if="wildIdea">
       <div class="text" v-html="$vuetify.t('$vuetify.Idea.supporterCount', proVotes,
       quorumRequiredVoters
       )">
       </div>
       <div class="bar">
           <div slot="activator" class="proVotes" :style="{width: `${proVotesPercent}%`}"></div>
       </div>
     </div>
     <div v-else>
      <div class="text" v-html="$vuetify.t('$vuetify.Idea.supporterCount', proVotes,
      quorumRequiredVoters
      )">
      </div>
      <div class="bar">
        <div class="quorumMin" :style="{left: `${quorumMinPercent}%`}">
          <v-tooltip top>
            <v-icon slot="activator">arrow_downward</v-icon>
            <span>{{ $vuetify.t('$vuetify.Idea.quorum') }}</span>
          </v-tooltip>
        </div>
        <v-tooltip top>
          <div slot="activator" class="proVotes" :style="{width: `${proVotesPercent}%`}"></div>
          <span>{{ $vuetify.t('$vuetify.Idea.proVotes') }}</span>
        </v-tooltip>
        <v-tooltip top>
          <div slot="activator" class="againstVotes" :style="{width: `${againstVotesPercent}%`, 'border-radius': againstBorder}"></div>
          <span>{{ $vuetify.t('$vuetify.Idea.againstVotes') }}</span>
        </v-tooltip>
      </div>
    </div>
   </div>
</template>

<script>

export default {
  name: 'VotesBar',
  components: {
  },
  props: [
    'proVotes',
    'quorumTotalVoters',
    'quorumRequiredVoters',
    'againstVotes',
    'wildIdea'
  ],
  data: function () {
    return {
    }
  },
  computed: {
    proVotesPercent: function () {
      return 100.0 * Math.min(this.proVotes / this.quorumTotalVoters, 1)
    },

    againstVotesPercent: function () {
      return 100.0 * Math.min(this.againstVotes / this.quorumTotalVoters, 1)
    },

    againstBorder: function () {
      if (this.proVotesPercent === 0) {
        return '10px 0 0 10px'
      } else {
        return '0'
      }
    },

    quorumMinPercent: function () {
      return 100.0 * Math.min(this.quorumRequiredVoters / this.quorumTotalVoters, 1)
    }
  }
}
</script>

<style scoped lang="scss">

  .quorum-info {
     background-color: #eee;
     padding: 7px 10px;
     border-radius: 4px;
     margin-bottom: 10px;
     width: 100%;

     .text {
       .supportNum {
         color: #00c853;
       }
       .neededNum {
         color: #777;
       }
       margin-bottom: 7px;
     }

     .bar {
        min-height: 10px;
        background-color: #bdbdbd;
        border-radius: 10px;
        position: relative;

        .quorumMin {
          position: absolute;
          top: -20px;

          i {
            margin-left: -50%;
          }
        }

        .proVotes {
          float: left;
           background-color: var(--v-primary-base);
           border-radius: 10px 0 0 10px;
           min-height: 10px;
           width: 50%;
           transition: width 0.5s;
        }

        .againstVotes {
          float: left;
           background-color:  var(--v-secondary-base);
           border-radius: 0 10px 10px 0;
           min-height: 10px;
           width: 50%;
           transition: width 0.5s;
        }

     }
  }
</style>
