const hre = require("hardhat");

async function main() {
  console.log("--- 部署 Voting ---");
  const Voting = await hre.ethers.getContractFactory("Voting");
  const voting = await Voting.deploy();
  await voting.waitForDeployment();
  console.log("Voting deployed to:", voting.target);

  const [admin, voter1, voter2, voter3] = await hre.ethers.getSigners();

  console.log("\n--- 添加候选人 ---");
  let tx = await voting.connect(admin).addCandidate("Alice");
  await tx.wait();
  tx = await voting.connect(admin).addCandidate("Bob");
  await tx.wait();
  tx = await voting.connect(admin).addCandidate("Charlie");
  await tx.wait();

  const count = await voting.getCandidateCount();
  console.log("候选人数:", count.toString());

  console.log("\n--- 投票 ---");
  tx = await voting.connect(voter1).vote(0);
  await tx.wait();
  console.log("voter1 投给了 Alice (0)");

  tx = await voting.connect(voter2).vote(0);
  await tx.wait();
  console.log("voter2 投给了 Alice (0)");

  tx = await voting.connect(voter3).vote(1);
  await tx.wait();
  console.log("voter3 投给了 Bob (1)");

  console.log("\n--- 结果 ---");
  for (let i = 0; i < Number(count); i++) {
    const c = await voting.getCandidate(i);
    console.log(`${c.name} (id=${c.id}): ${c.voteCount} 票`);
  }

  console.log("\nvoter1 是否已投票:", await voting.checkIfVoted(voter1.address));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});