import { useNavigate } from 'react-router-dom'
import logoImg from '../assets/logo.png'

export default function Reglement() {
  const navigate = useNavigate()

  return (
    <div className="container" style={{ paddingBottom: '48px' }}>
      <img className="logo" src={logoImg} alt="logo" />

      <div className="form-card" style={{ textAlign: 'left', maxWidth: '680px' }}>
        <button
          onClick={() => navigate(-1)}
          className="btn-back"
        >
          ← Retour
        </button>

        <h2>Règlement 9HBrouette 2026</h2>

        <h3>Partie 1 – Sécurité, responsabilités et règles de bonne conduite</h3>

        <h4>Assurances et responsabilité civile</h4>
        <ul>
          <li>Les équipes s'engagent à vérifier que les personnes qu'elles inscrivent sont en ordre d'assurance.</li>
          <li>L'assurance de la fédération scoute couvre uniquement les personnes participant à l'organisation des 9H Brouette.</li>
          <li>Les participants reconnaissent que la participation à la course comporte des risques physiques.</li>
          <li>Les sections veillent à inscrire uniquement des personnes en bon état de santé et aptes à participer pleinement à la course.</li>
          <li>Tous les participants doivent être âgés de plus de 12 ans.</li>
        </ul>

        <h4>Circulation et stationnement</h4>
        <ul>
          <li>Une zone de parking est prévue pour les participants et les spectateurs.</li>
          <li>Il est demandé de l'utiliser afin de ne pas gêner la circulation ni le voisinage.</li>
          <li>Seuls les véhicules des organisateurs sont autorisés à circuler sur le site de l'événement.</li>
          <li>Les conducteurs sont seuls responsables des dégâts pouvant survenir à leur véhicule, à d'autres véhicules ou à toute infrastructure durant la course, ainsi que des dommages causés par leur véhicule.</li>
        </ul>

        <h4>Sécurité sur le site</h4>
        <ul>
          <li>Un poste de secours est disponible sur le site en cas de besoin, avec la présence de la Croix-Rouge.</li>
          <li>En cas d'accident ou d'incident pouvant mettre en danger la sécurité d'une personne, les participants doivent immédiatement en informer les organisateurs ou l'équipe médicale.</li>
          <li>Si les conditions de sécurité ne sont plus assurées, les organisateurs peuvent décider à tout moment d'une interruption temporaire ou définitive de la course.</li>
          <li>En cas d'arrêt signalé par les organisateurs, les participants doivent immédiatement s'arrêter et ne reprendre la course qu'au signal donné.</li>
          <li>Tout concurrent ne respectant pas les consignes de sécurité pourra faire l'objet d'une pénalité individuelle ou collective, selon la gravité des faits.</li>
        </ul>

        <h4>Respect des consignes et des infrastructures</h4>
        <ul>
          <li>Les participants doivent respecter les consignes données par les organisateurs ainsi que celles des personnes chargées de la sécurité.</li>
          <li>Les participants doivent circuler sur le parcours dans le sens indiqué.</li>
          <li>Il est interdit de circuler à pied sur le parcours sans autorisation.</li>
          <li>Il est strictement interdit de déposer des déchets ailleurs que dans les endroits prévus à cet effet.</li>
          <li>Des toilettes sont mises à disposition dans l'enceinte de l'événement. Elles doivent être respectées.</li>
          <li>Il est strictement interdit de fumer en dehors des espaces prévus à cet effet.</li>
          <li>Une ECOCUP avec système de consigne sera utilisée pour les boissons.</li>
        </ul>

        <h4>Responsabilité en cas de dégâts, perte ou vol</h4>
        <ul>
          <li>Les dégâts causés par les participants ou les spectateurs sur des propriétés privées ou sur le site de l'événement sont de leur responsabilité.</li>
          <li>Les organisateurs déclinent toute responsabilité en cas de perte, de vol ou de détérioration des biens appartenant aux participants.</li>
        </ul>

        <h4>Organisation et dispositions générales</h4>
        <ul>
          <li>Chaque équipe dispose d'un paddock pour y déposer son matériel et ses effets personnels.</li>
          <li>Toute infraction au présent règlement peut entraîner une pénalisation de la section concernée et/ou l'exclusion immédiate de la personne ou de l'équipe.</li>
          <li>Tout cas non prévu par le présent règlement sera tranché par les organisateurs. Leur décision sera sans appel.</li>
          <li>L'organisation se réserve le droit de modifier les règles si la situation l'exige. Ces changements seront communiqués clairement à l'ensemble des participants.</li>
          <li>Les organisateurs se réservent le droit d'entrée.</li>
        </ul>

        <h4>Informations pratiques</h4>
        <ul>
          <li>📅 Date : 27 juin 2026</li>
          <li>📍 Lieu : Rue Croix-Chabot, Villers-le-Bouillet (entrée à côté du centre médical)</li>
          <li>Entrée prairie avant 19h : 5€ avec 2 jetons inclus</li>
          <li>Entrée prairie après 19h : 5€ sans jetons</li>
          <li>Jeton boisson : 1€</li>
          <li>Sortie définitive après 23h</li>
          <li>Restauration : pains saucisses à midi et burgers le soir avec option végétarienne</li>
          <li>En cas de questions, contactez-nous via Instagram.</li>
        </ul>

        <hr />

        <h3>Partie 2 – Règlement sportif de la course</h3>

        <h4>Principe de la course</h4>
        <ul>
          <li>La course de brouettes dure 9 heures, de 10h à 19h.</li>
          <li>Elle consiste à effectuer un maximum de tours sur un parcours défini.</li>
          <li>Des épreuves organisées chaque heure permettent de gagner des tours supplémentaires.</li>
          <li>Les brouettes électriques ou tout engin motorisé sont interdits.</li>
          <li>La brouette doit être composée au minimum de deux poignées, d'une roue et d'un numéro visible sur le flanc de la benne.</li>
          <li>La décoration n'est pas obligatoire mais est fortement conseillée.</li>
          <li>L'équipe gagnante du concours de décoration reçoit 20 tours supplémentaires.</li>
        </ul>

        <h4>Composition des équipes</h4>
        <ul>
          <li>Un concurrent ne peut faire partie que d'une seule équipe.</li>
          <li>Les équipes doivent être composées de 10 à 20 personnes maximum.</li>
        </ul>

        <h4>Stands et relais</h4>
        <ul>
          <li>Chaque équipe dispose d'un paddock.</li>
          <li>Le changement des coureurs transportés dans la brouette doit s'effectuer devant le paddock de la section concernée.</li>
          <li>Seul le relayeur effectuant le relais est autorisé à se trouver sur le circuit.</li>
          <li>Les autres membres de l'équipe doivent rester derrière la rubalise ou les barrières de séparation.</li>
        </ul>

        <h4>Réparation des brouettes</h4>
        <ul>
          <li>En cas de crevaison ou de dommage, les équipes sont autorisées à réparer leur brouette.</li>
          <li>Il est conseillé de prévoir une chambre à air, une roue ou une brouette de rechange.</li>
          <li>Les pneus increvables sont recommandés.</li>
          <li>Le matériel de réparation doit être apporté par les équipes elles-mêmes.</li>
        </ul>

        <h4>Classement et résultats</h4>
        <ul>
          <li>À la fin de la course, le dernier tour non terminé par chaque équipe ne sera pas pris en compte dans le classement final (sauf en cas de départage d'ex æquo).</li>
          <li>Le nombre de tours effectués est comptabilisé par l'organisation, en tenant compte des tours supplémentaires obtenus lors des épreuves et du concours de décoration.</li>
          <li>Les récompenses seront communiquées via les pages Instagram et Facebook de l'événement.</li>
        </ul>

        <h4>Inscription à la course</h4>
        <ul>
          <li>Inscription : 20€ par personne, comprenant l'entrée prairie, un pain saucisse et deux jetons.</li>
          <li>Les équipes doivent être composées de 10 à 20 personnes.</li>
        </ul>

        <button onClick={() => navigate(-1)} className="btn-submit" style={{ marginTop: '24px' }}>
          ← Retour au formulaire
        </button>
      </div>
    </div>
  )
}
